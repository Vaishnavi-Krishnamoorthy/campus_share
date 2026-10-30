import urllib.request
import json

endpoints = ['/api/health', '/api/resources', '/api/categories', '/api/resources/search?q=calculator']

for path in endpoints:
    url = 'http://localhost:5000' + path
    try:
        with urllib.request.urlopen(url) as resp:
            data = json.loads(resp.read().decode())
            print(f"{path}: status {resp.status}, keys={list(data.keys())}")
            if 'count' in data:
                print(f"  Count: {data['count']}")
    except Exception as e:
        print(f"{path}: ERROR {e}")
