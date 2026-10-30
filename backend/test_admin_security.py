import getpass
import json
import urllib.request
import urllib.error

BASE_URL = "http://127.0.0.1:8000"

username = input("Admin username: ")
password = getpass.getpass("Admin password: ")

payload = json.dumps({
    "username": username,
    "password": password,
}).encode()

request = urllib.request.Request(
    f"{BASE_URL}/api/auth/login/",
    data=payload,
    headers={"Content-Type": "application/json"},
    method="POST",
)

try:
    with urllib.request.urlopen(request) as response:
        data = json.loads(response.read().decode())
except urllib.error.HTTPError as error:
    print("Login failed:", error.code)
    print(error.read().decode())
    raise SystemExit

if not data.get("access"):
    print("Access token nahi mila.")
    raise SystemExit

if not (data.get("is_staff") or data.get("is_superuser")):
    print("WARNING: Login successful, lekin account admin nahi hai.")
    raise SystemExit

print("Admin login successful.")

# Read-only requests: koi data create ya modify nahi hoga.
for path in ["/api/categories/", "/api/products/"]:
    req = urllib.request.Request(
        f"{BASE_URL}{path}",
        headers={"Authorization": f"Bearer {data['access']}"},
    )
    try:
        with urllib.request.urlopen(req) as response:
            print(f"GET {path} -> HTTP {response.status}")
    except urllib.error.HTTPError as error:
        print(f"GET {path} -> HTTP {error.code}")
