// Middleware to log all API calls with colored HTTP methods
const methodColors = {
  GET: '\x1b[32m',      // Green
  POST: '\x1b[34m',     // Blue
  PUT: '\x1b[33m',      // Yellow
  DELETE: '\x1b[31m',   // Red
  PATCH: '\x1b[35m',    // Magenta
  DEFAULT: '\x1b[36m',  // Cyan
};

export default function logApiCalls(req, res, next) {
  const now = new Date().toISOString();
  const color = methodColors[req.method] || methodColors.DEFAULT;
  const reset = '\x1b[0m';
  console.log(`[${now}] ${color}${req.method}${reset} ${req.originalUrl}`);
  next();
} 