from openai import OpenAI
from dotenv import load_dotenv
import os, time
from httpx import RemoteProtocolError

# Load env vars
load_dotenv()
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

# Config
MAX_RETRIES = 3
QUERY = "1 line about cats."

def run_stream():
    """Start a streaming request and print tokens as they arrive."""
    with client.responses.stream(
        model="gpt-4o-mini",  # can switch to gpt-4o-mini for faster test
        input=[
            {"role": "developer", "content": [{"type": "input_text", "text": "You are a research assistant that searches MCP servers to find answers to your questions."}]},
            {"role": "user", "content": [{"type": "input_text", "text": QUERY}]}
        ],
        tools=[
            {
                "type": "mcp",
                "server_label": "cats",
                "server_url": "https://reimagined-journey-v49r69qrr56c5vr-8000.app.github.dev/sse",
                "allowed_tools": ["search", "fetch"],
                "require_approval": "never"
            }
        ]
    ) as stream:
        for event in stream:
            if event.type == "response.output_text.delta":
                print(event.delta, end="", flush=True)
            elif event.type == "response.error":
                print(f"\n❌ Error: {event.error}")

        # Get final response object after stream finishes
        final = stream.get_final_response()
        print("\n--- DONE ---")
        return final

# Retry loop
for attempt in range(1, MAX_RETRIES + 1):
    try:
        result = run_stream()
        break  # ✅ success
    except RemoteProtocolError as e:
        print(f"\n⚠️ Connection dropped (attempt {attempt}/{MAX_RETRIES}): {e}")
        if attempt < MAX_RETRIES:
            time.sleep(2)  # small backoff before retry
        else:
            print("❌ Failed after max retries.")
