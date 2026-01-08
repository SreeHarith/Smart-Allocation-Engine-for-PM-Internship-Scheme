import httpx
import asyncio

KEY = "AIzaSyDGAwamQeXjVDO45QDe8pHgx8RIQqZk91M"

async def list_models():
    url = f"https://generativelanguage.googleapis.com/v1beta/models?key={KEY}"
    
    print(f"Testing URL: {url.replace(KEY, 'HIDDEN_KEY')}")
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url)
            print(f"Status Code: {response.status_code}")
            if response.status_code == 200:
                import json
                with open("models.json", "w") as f:
                    json.dump(data, f, indent=2)
                print("Models JSON saved to models.json")
            else:
                print("FAILED! Response:")
                print(response.text)
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(list_models())
