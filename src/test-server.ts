#!/usr/bin/env node

// Simple test script to verify the server works
import { SampleMCPServer } from './index.js';

async function testServer() {
  console.log('Creating SampleMCPServer instance...');
  const server = new SampleMCPServer();
  
  // Verify server instance was created successfully
  if (server) {
    console.log('Server created successfully!');
    console.log('To test the server with an MCP client, run:');
    console.log('npm start');
    
    console.log('\nServer capabilities:');
    console.log('- Search: Find content by query and tags');
    console.log('- Fetch: Retrieve specific content by ID or URL');
    console.log('- Analyze: Extract summaries, keywords, sentiment, and entities');
  }
}

testServer().catch(console.error);