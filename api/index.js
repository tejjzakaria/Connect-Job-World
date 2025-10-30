// Vercel Serverless Function Entry Point
// This file adapts the Express app to work as a Vercel serverless function

import app from '../server/server.js';

// Export the Express app as a serverless function
export default app;
