import urllib.request
import json
import os
import sys

base_url = os.environ.get('CAMPUS_SHARE_API_URL', 'http://localhost:5000').rstrip('/')
endpoints = {
    '/api/health': 'status',
    '/api/resources': 'resources',
    '/api/categories': 'categories',
    '/api/resources/search?q=calculator': 'resources',
}

for path, expected_key in endpoints.items():
    url = base_url + path
    try:
        with urllib.request.urlopen(url, timeout=5) as resp:
            data = json.loads(resp.read().decode())
            if resp.status != 200 or expected_key not in data:
                raise ValueError(f"unexpected response: HTTP {resp.status}, keys={list(data)}")
            if path == '/api/health' and data['status'] != 'healthy':
                raise ValueError(f"API health is {data['status']!r}")
            print(f"{path}: OK")
    except (OSError, ValueError, json.JSONDecodeError) as error:
        print(f"{path}: ERROR {error}", file=sys.stderr)
        sys.exit(1)
