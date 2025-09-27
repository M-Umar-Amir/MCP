# MCP

## Overview

MCP is a sample implementation of the Model Context Protocol (MCP) for integrating with ChatGPT and similar AI models. It includes:

- **FastMCP.py**: An MCP server using FastMCP, providing search and fetch tools for document retrieval and semantic search via OpenAI’s API.
- **Client.py**: A client script that streams queries to the MCP server using OpenAI’s API, with automatic retries and token streaming.

## Features

- **MCP Server**: Search and fetch documents using semantic queries.
- **OpenAI Integration**: Uses OpenAI’s API for vector search and chat.
- **Streaming Client**: Streams responses and handles connection errors with retries.

## Setup

1. Clone the repository.
2. Install dependencies:
	 ```bash
	 pip install -r requirements.txt
	 ```
3. Set environment variables in a `.env` file:
	 ```
	 OPENAI_API_KEY=your_openai_api_key
	 VECTOR_STORE_ID=your_vector_store_id
	 ```

## Usage

- **Start the MCP server**:
	```bash
	python FastMCP.py
	```
- **Run the client**:
	```bash
	python Client.py
	```

**Note:**
In `Client.py` (line 26), update the `server_url` in the `tools` section to match your MCP server address. The provided URL is for Codespaces:

```
https://reimagined-journey-v49r69qrr56c5vr-8000.app.github.dev/sse
```

For normal local use, change it to:

```
http://127.0.0.1:8000/sse
```

## Files

- `FastMCP.py`: MCP server implementation.
- `Client.py`: Streaming client for querying the MCP server.
- `README.md`: Project documentation.