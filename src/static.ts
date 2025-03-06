import { promises as fs } from 'fs';
import { join, extname } from 'path';
import { Response } from './response';

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
};

export async function serveStatic(
  filePath: string,
  res: Response,
  staticDir: string
): Promise<void> {
  try {
    // Normalize the path to prevent path traversal attacks
    const normalizedPath = filePath.replace(/^(\.\.[\/\\])+/, '');
    const fullPath = join(staticDir, normalizedPath);
    
    console.log(`Attempting to serve static file: ${fullPath}`);
    
    let stats;
    try {
      stats = await fs.stat(fullPath);
    } catch (error) {
      console.error(`File not found: ${fullPath}`, error);
      res.status(404).send('File not found');
      return;
    }
    
    if (stats.isDirectory()) {
      // Try to serve index.html from directory
      return serveStatic(join(filePath, 'index.html'), res, staticDir);
    }
    
    const data = await fs.readFile(fullPath);
    const ext = extname(fullPath).toLowerCase();
    
    res
      .status(200)
      .setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream')
      .send(data);
      
    console.log(`Successfully served: ${fullPath}`);
  } catch (error) {
    console.error('Error serving static file:', error);
    res.status(500).send('Error serving file');
  }
}