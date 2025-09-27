# Search Examples

## Basic search
```json
{
  "name": "search",
  "arguments": {
    "query": "ChatGPT integration"
  }
}
```

## Search with tag filtering
```json
{
  "name": "search",
  "arguments": {
    "query": "best practices",
    "tags": ["integration", "chatgpt"],
    "limit": 3
  }
}
```

## Search for MCP information
```json
{
  "name": "search",
  "arguments": {
    "query": "Model Context Protocol",
    "limit": 5
  }
}
```

# Fetch Examples

## Fetch by ID
```json
{
  "name": "fetch",
  "arguments": {
    "identifier": "1"
  }
}
```

## Fetch by URL with JSON format
```json
{
  "name": "fetch",
  "arguments": {
    "identifier": "https://example.com/mcp-intro",
    "format": "json"
  }
}
```

## Fetch raw content
```json
{
  "name": "fetch",
  "arguments": {
    "identifier": "2",
    "format": "raw"
  }
}
```

# Analysis Examples

## Generate summary
```json
{
  "name": "analyze_content",
  "arguments": {
    "content": "The Model Context Protocol (MCP) is a standardized protocol that enables AI assistants to securely access external data sources and tools. It provides a structured way for AI models to interact with various services and databases.",
    "analysis_type": "summary"
  }
}
```

## Extract keywords
```json
{
  "name": "analyze_content",
  "arguments": {
    "content": "When integrating with ChatGPT, it's important to follow best practices for context management, error handling, and response formatting. This ensures optimal performance and user experience.",
    "analysis_type": "keywords"
  }
}
```

## Sentiment analysis
```json
{
  "name": "analyze_content",
  "arguments": {
    "content": "This is an amazing implementation that works perfectly with ChatGPT. I love how easy it is to use!",
    "analysis_type": "sentiment"
  }
}
```

## Entity extraction
```json
{
  "name": "analyze_content",
  "arguments": {
    "content": "Microsoft Azure and Amazon Web Services are leading cloud providers. Google Cloud Platform is also gaining market share.",
    "analysis_type": "entities"
  }
}
```