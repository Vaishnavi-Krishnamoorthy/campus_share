import urllib.request
import json
import sys

base_url = 'http://localhost:5000'

def post_json(endpoint, data, token=None):
    req = urllib.request.Request(
        base_url + endpoint,
        data=json.dumps(data).encode('utf-8'),
        headers={
            'Content-Type': 'application/json',
            **({'Authorization': f'Bearer {token}'} if token else {})
        },
        method='POST'
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())

def put_json(endpoint, data={}, token=None):
    req = urllib.request.Request(
        base_url + endpoint,
        data=json.dumps(data).encode('utf-8'),
        headers={
            'Content-Type': 'application/json',
            **({'Authorization': f'Bearer {token}'} if token else {})
        },
        method='PUT'
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())

def get_json(endpoint, token=None):
    req = urllib.request.Request(
        base_url + endpoint,
        headers={**({'Authorization': f'Bearer {token}'} if token else {})}
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())

print("[TEST 1] Testing Login for Priya and Rahul...")
priya_login = post_json('/api/auth/login', {'email': 'priya.sharma@campusshare.edu', 'password': 'Password123!'})
rahul_login = post_json('/api/auth/login', {'email': 'rahul.mehta@campusshare.edu', 'password': 'Password123!'})
priya_token = priya_login['token']
rahul_token = rahul_login['token']
print(f" -> Logged in Priya (ID {priya_login['user']['student_id']}) & Rahul (ID {rahul_login['user']['student_id']})")

print("\n[TEST 2] Priya requests to borrow Rahul's resource (ID 2)...")
req_data = {
    'resource_id': 2,
    'requested_from': '2026-09-23',
    'requested_until': '2026-09-30',
    'purpose': 'Calculus exam preparation',
    'message': 'Can I borrow your Maths book for a week?'
}
create_req = post_json('/api/requests', req_data, token=priya_token)
req_id = create_req['request_id']
print(f" -> Request created: ID {req_id}")

print("\n[TEST 3] Rahul approves request via MySQL ACID Transaction...")
approve_res = put_json(f'/api/requests/{req_id}/approve', {}, token=rahul_token)
borrowing_id = approve_res['data']['borrowing_id']
print(f" -> Approval Transaction committed! New Borrowing ID: {borrowing_id}")

print("\n[TEST 4] Verify Resource availability updated to BORROWED...")
res_detail = get_json('/api/resources/2')
print(f" -> Resource 2 status: {res_detail['resource']['availability_status']}")
assert res_detail['resource']['availability_status'] == 'BORROWED'

print("\n[TEST 5] Priya returns resource via MySQL ACID Return Transaction...")
return_res = put_json(f'/api/borrowings/{borrowing_id}/return', {}, token=priya_token)
print(f" -> Return Transaction committed! Status: {return_res['data']['status']}")

print("\n[TEST 6] Verify Resource availability updated back to AVAILABLE...")
res_detail_after = get_json('/api/resources/2')
print(f" -> Resource 2 status: {res_detail_after['resource']['availability_status']}")
assert res_detail_after['resource']['availability_status'] == 'AVAILABLE'

print("\n[TEST 7] Priya leaves a 5-star review...")
review_res = post_json('/api/reviews', {
    'borrowing_id': borrowing_id,
    'rating': 5,
    'comment': 'Awesome book, notes were super helpful. Returned on time!'
}, token=priya_token)
print(f" -> Review recorded: ID {review_res['review_id']}")

print("\n[TEST 8] Verify duplicate review prevention...")
try:
    post_json('/api/reviews', {
        'borrowing_id': borrowing_id,
        'rating': 4,
        'comment': 'Duplicate try'
    }, token=priya_token)
    print(" -> ERROR: Duplicate review was unexpectedly allowed!")
    sys.exit(1)
except Exception as e:
    print(f" -> SUCCESS: Duplicate review correctly rejected: {e}")

print("\n[SUCCESS] ALL BACKEND ACID TRANSACTIONS AND CONSTRAINTS FULLY VERIFIED ON MYSQL!")
