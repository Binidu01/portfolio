export default function handler(req, res) {
  return {
    message: 'Hello from Bini.js API!',
    timestamp: new Date().toISOString(),
    method: req.method,
    environment: process.env.NODE_ENV || 'development'
  }
}