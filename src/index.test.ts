import { SampleMCPServer } from './index.js';

// Mock the transport to avoid stdio issues in tests
jest.mock('@modelcontextprotocol/sdk/server/stdio.js');

describe('SampleMCPServer', () => {
  let server: SampleMCPServer;
  
  beforeEach(() => {
    server = new SampleMCPServer();
  });

  test('should create server instance', () => {
    expect(server).toBeInstanceOf(SampleMCPServer);
  });

  test('should export SampleMCPServer class', () => {
    expect(SampleMCPServer).toBeDefined();
    expect(typeof SampleMCPServer).toBe('function');
  });
});