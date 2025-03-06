// queryHandler.ts
import { Request } from './request';
import { Response } from './response';
import { Middleware } from './middleware';

// Define some sample data to respond to queries
const knowledgeBase: Record<string, string> = {
  'server': 'This is a TypeScript HTTP server implementation with middleware support, routing, and static file serving.',
  'features': 'The server supports middleware, routing, static file serving, error handling, and query processing.',
  'author': 'The server was implemented by you as a TypeScript project.',
  'technologies': 'This server uses TypeScript, Node.js HTTP module, and follows a modular architecture pattern.',
  'endpoints': 'Available endpoints include /api/hello, /api/data, /api/query, and static file serving from the public directory.'
};

// Define a default response for unknown queries
const defaultResponse = "I don't have information about that query. Try asking about 'server', 'features', 'author', 'technologies', or 'endpoints'.";

// Create a function to find the best match for a query
function findBestMatch(query: string): string {
  query = query.toLowerCase();
  
  // Direct match
  if (knowledgeBase[query]) {
    return knowledgeBase[query];
  }
  
  // Check for partial matches
  for (const [key, value] of Object.entries(knowledgeBase)) {
    if (query.includes(key) || key.includes(query)) {
      return value;
    }
  }
  
  // Search in content
  for (const [key, value] of Object.entries(knowledgeBase)) {
    if (value.toLowerCase().includes(query)) {
      return value;
    }
  }
  
  return defaultResponse;
}

// The query handler middleware
export const queryHandler: Middleware = async (req: Request, res: Response, next: () => Promise<void>) => {
  if (req.path === '/api/query') {
    const query = req.queryParams.q || '';
    
    if (!query) {
      res.status(400).json({ 
        error: 'Missing query parameter',
        usage: 'Use /api/query?q=your_question'
      });
      return;
    }
    
    const answer = findBestMatch(query);
    
    res.json({
      query,
      answer,
      timestamp: new Date().toISOString()
    });
    return;
  }
  
  await next();
};