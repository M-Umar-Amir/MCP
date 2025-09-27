#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Types for our server
interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  url: string;
  relevanceScore: number;
}

interface FetchResult {
  url: string;
  content: string;
  contentType: string;
  lastModified?: string;
  size: number;
}

interface DatabaseItem {
  id: string;
  title: string;
  content: string;
  url: string;
  tags: string[];
  relevanceScore?: number;
}

// Mock data store - in a real implementation, this would connect to actual data sources
const mockDatabase: DatabaseItem[] = [
  {
    id: '1',
    title: 'Introduction to Model Context Protocol',
    content: 'The Model Context Protocol (MCP) is a standardized protocol that enables AI assistants to securely access external data sources and tools. It provides a structured way for AI models to interact with various services and databases.',
    url: 'https://example.com/mcp-intro',
    tags: ['mcp', 'ai', 'protocol'],
  },
  {
    id: '2',
    title: 'ChatGPT Integration Best Practices',
    content: 'When integrating with ChatGPT, it\'s important to follow best practices for context management, error handling, and response formatting. This ensures optimal performance and user experience.',
    url: 'https://example.com/chatgpt-integration',
    tags: ['chatgpt', 'integration', 'best-practices'],
  },
  {
    id: '3',
    title: 'Search and Fetch Capabilities',
    content: 'Modern AI assistants require robust search and fetch capabilities to access and retrieve information from various sources. This includes full-text search, semantic search, and content retrieval mechanisms.',
    url: 'https://example.com/search-fetch',
    tags: ['search', 'fetch', 'capabilities'],
  },
];

class SampleMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'sample-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers(): void {
    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: 'search://database',
            mimeType: 'application/json',
            name: 'Search Database',
            description: 'Search through the mock database for relevant content',
          },
          {
            uri: 'fetch://content',
            mimeType: 'text/plain',
            name: 'Fetch Content',
            description: 'Fetch specific content by URL or ID',
          },
        ],
      };
    });

    // Read resource content
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;

      if (uri === 'search://database') {
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(mockDatabase, null, 2),
            },
          ],
        };
      }

      if (uri.startsWith('fetch://content/')) {
        const id = uri.split('/').pop();
        const item = mockDatabase.find((item) => item.id === id);
        
        if (item) {
          return {
            contents: [
              {
                uri,
                mimeType: 'text/plain',
                text: item.content,
              },
            ],
          };
        }
      }

      throw new Error(`Resource not found: ${uri}`);
    });

    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'search',
            description: 'Search for content based on query terms',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query string',
                },
                limit: {
                  type: 'number',
                  description: 'Maximum number of results to return',
                  default: 10,
                },
                tags: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Filter by tags',
                },
              },
              required: ['query'],
            },
          },
          {
            name: 'fetch',
            description: 'Fetch specific content by URL or ID',
            inputSchema: {
              type: 'object',
              properties: {
                identifier: {
                  type: 'string',
                  description: 'URL or ID of the content to fetch',
                },
                format: {
                  type: 'string',
                  enum: ['text', 'json', 'raw'],
                  description: 'Output format for the fetched content',
                  default: 'text',
                },
              },
              required: ['identifier'],
            },
          },
          {
            name: 'analyze_content',
            description: 'Analyze content and extract key information',
            inputSchema: {
              type: 'object',
              properties: {
                content: {
                  type: 'string',
                  description: 'Content to analyze',
                },
                analysis_type: {
                  type: 'string',
                  enum: ['summary', 'keywords', 'sentiment', 'entities'],
                  description: 'Type of analysis to perform',
                  default: 'summary',
                },
              },
              required: ['content'],
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'search':
          return this.handleSearch(args);
        case 'fetch':
          return this.handleFetch(args);
        case 'analyze_content':
          return this.handleAnalyzeContent(args);
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  private async handleSearch(args: any): Promise<any> {
    const { query, limit = 10, tags } = args;
    
    let results = mockDatabase.filter((item) => {
      // Simple text search in title and content
      const searchText = `${item.title} ${item.content}`.toLowerCase();
      const queryMatch = query.toLowerCase().split(' ').some((term: string) =>
        searchText.includes(term)
      );
      
      // Tag filtering if specified
      const tagMatch = !tags || tags.some((tag: string) =>
        item.tags.includes(tag.toLowerCase())
      );
      
      return queryMatch && tagMatch;
    });

    // Sort by relevance (simple scoring based on title matches)
    results = results.map((item) => ({
      ...item,
      relevanceScore: item.title.toLowerCase().includes(query.toLowerCase()) ? 1.0 : 0.5,
    })).sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Limit results
    results = results.slice(0, limit);

    const searchResults: SearchResult[] = results.map((item) => ({
      id: item.id,
      title: item.title,
      snippet: item.content.substring(0, 150) + '...',
      url: item.url,
      relevanceScore: item.relevanceScore || 0.5,
    }));

    return {
      content: [
        {
          type: 'text',
          text: `Found ${searchResults.length} results for query "${query}":\n\n${
            searchResults
              .map(
                (result) =>
                  `**${result.title}** (Score: ${result.relevanceScore})\n${result.snippet}\nURL: ${result.url}\nID: ${result.id}\n`
              )
              .join('\n')
          }`,
        },
      ],
    };
  }

  private async handleFetch(args: any): Promise<any> {
    const { identifier, format = 'text' } = args;
    
    // Try to find by ID first
    let item = mockDatabase.find((item) => item.id === identifier);
    
    // If not found by ID, try by URL
    if (!item) {
      item = mockDatabase.find((item) => item.url === identifier);
    }
    
    if (!item) {
      throw new Error(`Content not found for identifier: ${identifier}`);
    }

    const fetchResult: FetchResult = {
      url: item.url,
      content: item.content,
      contentType: 'text/plain',
      size: item.content.length,
      lastModified: new Date().toISOString(),
    };

    let responseText: string;
    
    switch (format) {
      case 'json':
        responseText = JSON.stringify(fetchResult, null, 2);
        break;
      case 'raw':
        responseText = item.content;
        break;
      case 'text':
      default:
        responseText = `**${item.title}**\n\n${item.content}\n\nMetadata:\n- URL: ${item.url}\n- Size: ${fetchResult.size} characters\n- Tags: ${item.tags.join(', ')}`;
        break;
    }

    return {
      content: [
        {
          type: 'text',
          text: responseText,
        },
      ],
    };
  }

  private async handleAnalyzeContent(args: any): Promise<any> {
    const { content, analysis_type = 'summary' } = args;
    
    let analysisResult: string;
    
    switch (analysis_type) {
      case 'summary': {
        // Simple summary - first two sentences or first 200 chars
        const sentences = content.split(/[.!?]+/);
        analysisResult = sentences.slice(0, 2).join('. ').substring(0, 200) + '...';
        break;
      }
        
      case 'keywords': {
        // Extract keywords - simple approach using word frequency
        const words = content.toLowerCase()
          .replace(/[^\w\s]/g, '')
          .split(/\s+/)
          .filter((word: string) => word.length > 3);
        const wordCounts = words.reduce((acc: Record<string, number>, word: string) => {
          acc[word] = (acc[word] || 0) + 1;
          return acc;
        }, {});
        const keywords = Object.entries(wordCounts)
          .sort(([, a], [, b]) => (b as number) - (a as number))
          .slice(0, 10)
          .map(([word]) => word);
        analysisResult = `Keywords: ${keywords.join(', ')}`;
        break;
      }
        
      case 'sentiment': {
        // Simple sentiment analysis based on word lists
        const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'best', 'love', 'perfect'];
        const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'horrible', 'disappointing'];
        
        const lowerContent = content.toLowerCase();
        const positiveCount = positiveWords.filter(word => lowerContent.includes(word)).length;
        const negativeCount = negativeWords.filter(word => lowerContent.includes(word)).length;
        
        let sentiment = 'neutral';
        if (positiveCount > negativeCount) sentiment = 'positive';
        if (negativeCount > positiveCount) sentiment = 'negative';
        
        analysisResult = `Sentiment: ${sentiment} (positive: ${positiveCount}, negative: ${negativeCount})`;
        break;
      }
        
      case 'entities': {
        // Simple entity extraction - find capitalized words
        const entities = content.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];
        const uniqueEntities = [...new Set(entities)].slice(0, 10);
        analysisResult = `Entities: ${uniqueEntities.join(', ')}`;
        break;
      }
        
      default:
        throw new Error(`Unknown analysis type: ${analysis_type}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: `Analysis Result (${analysis_type}):\n${analysisResult}`,
        },
      ],
    };
  }

  public async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Sample MCP Server started and connected via stdio');
  }
}

// Start the server
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new SampleMCPServer();
  server.start().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}

export { SampleMCPServer };