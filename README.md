# Sample MCP Server for ChatGPT Integration

This repository implements a **Model Context Protocol (MCP) server** with search and fetch capabilities designed to work with ChatGPT's chat and deep research features.

## Overview

The Model Context Protocol (MCP) is a standardized protocol that enables AI assistants to securely access external data sources and tools. This sample server demonstrates how to:

- 🔍 **Search capabilities**: Find relevant content using text-based queries and tag filtering
- 📥 **Fetch capabilities**: Retrieve specific content by URL or ID  
- 🧠 **Content analysis**: Analyze content for summaries, keywords, sentiment, and entities
- 🤖 **ChatGPT integration**: Optimized for use with ChatGPT's advanced features

## Features

### Core MCP Capabilities
- **Resources**: Access to searchable database and fetchable content
- **Tools**: Search, fetch, and analyze content tools
- **Protocol compliance**: Fully implements MCP specification

### Available Tools

1. **search** - Search for content based on query terms
   - Full-text search across titles and content
   - Tag-based filtering
   - Relevance scoring
   - Configurable result limits

2. **fetch** - Retrieve specific content by URL or ID
   - Multiple output formats (text, JSON, raw)
   - Metadata inclusion
   - Error handling for missing content

3. **analyze_content** - Analyze content and extract key information
   - Summary generation
   - Keyword extraction
   - Sentiment analysis
   - Entity recognition

## Installation

```bash
# Clone the repository
git clone https://github.com/M-Umar-Amir/MCP.git
cd MCP

# Install dependencies
npm install

# Build the project
npm run build
```

## Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Running with ChatGPT

To use this MCP server with ChatGPT, you'll need to configure it in your MCP client configuration. The server communicates via stdio transport.

Example configuration entry:
```json
{
  "mcpServers": {
    "sample-server": {
      "command": "node",
      "args": ["dist/index.js"],
      "cwd": "/path/to/MCP"
    }
  }
}
```

## API Reference

### Tools

#### search
Search for content in the database.

**Parameters:**
- `query` (string, required): Search query string
- `limit` (number, optional): Maximum results to return (default: 10)
- `tags` (array, optional): Filter by specific tags

**Example:**
```json
{
  "name": "search",
  "arguments": {
    "query": "ChatGPT integration",
    "limit": 5,
    "tags": ["integration", "chatgpt"]
  }
}
```

#### fetch
Retrieve specific content by identifier.

**Parameters:**
- `identifier` (string, required): URL or ID of content to fetch
- `format` (string, optional): Output format - "text", "json", or "raw" (default: "text")

**Example:**
```json
{
  "name": "fetch",
  "arguments": {
    "identifier": "2",
    "format": "json"
  }
}
```

#### analyze_content
Analyze content and extract information.

**Parameters:**
- `content` (string, required): Content to analyze
- `analysis_type` (string, optional): Type of analysis - "summary", "keywords", "sentiment", or "entities" (default: "summary")

**Example:**
```json
{
  "name": "analyze_content",
  "arguments": {
    "content": "Your content here...",
    "analysis_type": "keywords"
  }
}
```

### Resources

- `search://database`: Access to the complete searchable database
- `fetch://content/{id}`: Direct access to specific content items

## Development

### Project Structure
```
src/
├── index.ts          # Main server implementation
├── types.ts          # Type definitions (if needed)
└── ...

dist/                 # Compiled JavaScript output
tests/                # Test files
```

### Available Scripts

- `npm run build`: Build the TypeScript project
- `npm run dev`: Run in development mode with hot reload
- `npm start`: Start the production server
- `npm test`: Run tests
- `npm run lint`: Run ESLint
- `npm run clean`: Clean build artifacts

### Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## Sample Data

The server includes sample data about:
- Model Context Protocol documentation
- ChatGPT integration best practices  
- Search and fetch capabilities information

In a production environment, you would replace the mock database with connections to real data sources like:
- Databases (PostgreSQL, MongoDB, etc.)
- APIs (REST, GraphQL)
- File systems
- Web scraping services
- Document stores

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Learn More

- [Model Context Protocol Specification](https://modelcontextprotocol.io/docs)
- [ChatGPT Documentation](https://platform.openai.com/docs)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)