import google.generativeai as genai
import os

# Explicitly set the key
KEY = "AIzaSyDGAwamQeXjVDO45QDe8pHgx8RIQqZk91M"
os.environ["GOOGLE_API_KEY"] = KEY
genai.configure(api_key=KEY)

print("--- Testing Gemini Connection ---")

try:
    print("Listing available models...")
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"- {m.name}")
            
    print("\nAttempting generation with 'gemini-1.5-flash'...")
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content("Hello")
    print(f"Success! Response: {response.text}")

except Exception as e:
    print(f"\nERROR: {e}")
    
    print("\nAttempting generation with 'gemini-pro'...")
    try:
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content("Hello")
        print(f"Success! Response: {response.text}")
    except Exception as e2:
        print(f"ERROR with gemini-pro: {e2}")
