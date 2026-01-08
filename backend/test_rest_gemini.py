import httpx
import asyncio

KEY = "AIzaSyDGAwamQeXjVDO45QDe8pHgx8RIQqZk91M"

async def test_rest():
    models = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-pro", "gemini-1.0-pro"]
    
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [{
            "parts": [{"text": "Hello, mentor!"}]
        }]
    }

    for m in models:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent?key={KEY}"
        print(f"\n--- Testing Model: {m} ---")
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(url, json=payload, headers=headers)
                print(f"Status: {response.status_code}")
                if response.status_code == 200:
                    print("SUCCESS! This model works.")
                    print(response.json())
                    break
                else:
                    print(f"Failed: {response.text[:200]}") # Print first 200 chars
            except Exception as e:
                print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_rest())
