import { HttpServer } from './server';
import { serveStatic } from './static';
import { Request } from './request';
import { Response } from './response';
import { queryHandler } from './queryHandler'; // Assuming you've created this file

const server = new HttpServer({ port: 3000, staticDir: 'public' });

// Middleware to log requests
server.use(async (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  await next();
});

// Add query handler middleware
server.use(queryHandler);

// Create a more robust static file middleware
server.use(async (req, res, next) => {
  // Only handle GET requests for static files
  if (req.method === 'GET' && !req.url.startsWith('/api/')) {
    try {
      // Extract path from URL (removing query parameters)
      let path = req.path;
      
      // Default to index.html for the root path
      if (path === '/') {
        path = '/index.html';
      }
      
      // Remove leading slash
      path = path.substring(1);
      
      await serveStatic(path, res, server.getConfig().staticDir || 'public');
      // If successful, we don't call next() because the response is already sent
    } catch (error) {
      // If file serving fails, continue to the next middleware
      await next();
    }
  } else {
    await next();
  }
});

// API routes
server.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, world!' });
});

server.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

// Handle POST requests for queries
server.post('/api/query', async (req, res) => {
  try {
    const bodyData = await req.body;
    const bodyString = bodyData.toString();
    let query = '';
    
    try {
      // Try to parse JSON
      const jsonData = JSON.parse(bodyString);
      query = jsonData.query || '';
    } catch (e) {
      // Handle form data
      const params = new URLSearchParams(bodyString);
      query = params.get('query') || '';
    }
    
    if (!query) {
      res.status(400).json({ 
        error: 'Missing query parameter',
        usage: 'Send a JSON body with {"query": "your_question"} or form data with query=your_question'
      });
      return;
    }
    
    const knowledgeBase: Record<string, string> = {
      'server': 'This is a TypeScript HTTP server implementation with middleware support, routing, and static file serving.',
      'features': 'The server supports middleware, routing, static file serving, error handling, and query processing.',
      'author': 'The server was implemented by you as a TypeScript project.',
      'technologies': 'This server uses TypeScript, Node.js HTTP module, and follows a modular architecture pattern.',
      'endpoints': 'Available endpoints include /api/hello, /api/data, /api/query, and static file serving from the public directory.'
    };
    
    const defaultResponse = "I don't have information about that query. Try asking about 'server', 'features', 'author', 'technologies', or 'endpoints'.";
    
    function findBestMatch(q: string): string {
      q = q.toLowerCase();
      
      // Direct match
      if (knowledgeBase[q]) {
        return knowledgeBase[q];
      }
      
      // Check for partial matches
      for (const [key, value] of Object.entries(knowledgeBase)) {
        if (q.includes(key) || key.includes(q)) {
          return value;
        }
      }
      
      // Search in content
      for (const [key, value] of Object.entries(knowledgeBase)) {
        if (value.toLowerCase().includes(q)) {
          return value;
        }
      }
      
      return defaultResponse;
    }
    
    const answer = findBestMatch(query);
    
    res.json({
      query,
      answer,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error processing query' });
  }
});

// Handle 404 errors for undefined routes
server.use(async (req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString()
  });
});

// Start the server
server.start();