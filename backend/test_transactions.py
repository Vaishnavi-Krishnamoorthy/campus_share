import json
import os
import sys
import urllib.error
import urllib.request
from datetime import date, timedelta


base_url = os.environ.get('CAMPUS_SHARE_API_URL', 'http://localhost:5000').rstrip('/')
borrower_email = os.environ.get('CAMPUS_SHARE_TEST_BORROWER_EMAIL')
owner_email = os.environ.get('CAMPUS_SHARE_TEST_OWNER_EMAIL')
password = os.environ.get('CAMPUS_SHARE_TEST_PASSWORD')
resource_id = os.environ.get('CAMPUS_SHARE_TEST_RESOURCE_ID')


def request_json(method, endpoint, data=None, token=None):
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    body = json.dumps(data or {}).encode('utf-8') if method != 'GET' else None
    request = urllib.request.Request(
        base_url + endpoint,
        data=body,
        headers=headers,
        method=method
    )
    with urllib.request.urlopen(request, timeout=10) as response:
        return json.loads(response.read().decode())


def assert_success(response, operation):
    if response.get('success') is not True:
        raise AssertionError(f'{operation} failed: {response}')


def main():
    if not all((borrower_email, owner_email, password, resource_id)):
        raise ValueError(
            'Set CAMPUS_SHARE_TEST_BORROWER_EMAIL, CAMPUS_SHARE_TEST_OWNER_EMAIL, '
            'CAMPUS_SHARE_TEST_PASSWORD, and CAMPUS_SHARE_TEST_RESOURCE_ID to '
            'existing seeded test data before running transaction tests.'
        )

    print('[TEST 1] Logging in borrower and resource owner...')
    borrower_login = request_json(
        'POST', '/api/auth/login', {'email': borrower_email, 'password': password}
    )
    owner_login = request_json(
        'POST', '/api/auth/login', {'email': owner_email, 'password': password}
    )
    assert_success(borrower_login, 'Borrower login')
    assert_success(owner_login, 'Owner login')
    borrower_token = borrower_login['token']
    owner_token = owner_login['token']

    print('[TEST 2] Creating a borrow request...')
    today = date.today()
    request_response = request_json('POST', '/api/requests', {
        'resource_id': int(resource_id),
        'requested_from': (today + timedelta(days=1)).isoformat(),
        'requested_until': (today + timedelta(days=8)).isoformat(),
        'purpose': 'CampusShare transaction integration test',
        'message': 'Automated test request'
    }, borrower_token)
    assert_success(request_response, 'Create request')
    request_id = request_response['request_id']

    print('[TEST 3] Approving request and verifying resource state...')
    approval = request_json(
        'PUT', f'/api/requests/{request_id}/approve', token=owner_token
    )
    assert_success(approval, 'Approve request')
    borrowing_id = approval['data']['borrowing_id']
    resource = request_json('GET', f'/api/resources/{resource_id}')
    if resource['resource']['availability_status'] != 'BORROWED':
        raise AssertionError('Resource was not marked BORROWED after approval.')

    print('[TEST 4] Returning resource and verifying availability...')
    returned = request_json(
        'PUT', f'/api/borrowings/{borrowing_id}/return', token=borrower_token
    )
    assert_success(returned, 'Return resource')
    resource = request_json('GET', f'/api/resources/{resource_id}')
    if resource['resource']['availability_status'] != 'AVAILABLE':
        raise AssertionError('Resource was not marked AVAILABLE after return.')

    print('[TEST 5] Creating a review and verifying duplicate rejection...')
    review = request_json('POST', '/api/reviews', {
        'borrowing_id': borrowing_id,
        'rating': 5,
        'comment': 'Automated transaction integration test'
    }, borrower_token)
    assert_success(review, 'Create review')

    try:
        request_json('POST', '/api/reviews', {
            'borrowing_id': borrowing_id,
            'rating': 4,
            'comment': 'Duplicate review attempt'
        }, borrower_token)
    except urllib.error.HTTPError as error:
        if error.code != 409:
            raise
    else:
        raise AssertionError('A duplicate review was unexpectedly accepted.')

    print('[SUCCESS] Borrow request, approval, return, and review checks passed.')


if __name__ == '__main__':
    try:
        main()
    except (AssertionError, KeyError, OSError, ValueError, urllib.error.HTTPError) as error:
        print(f'[FAILURE] {error}', file=sys.stderr)
        sys.exit(1)
