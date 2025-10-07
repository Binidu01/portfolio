// Posts API - Add Firebase/MongoDB when needed

let posts = [
  { id: 1, title: 'First Post', content: 'Hello world!' },
  { id: 2, title: 'Second Post', content: 'API routes are awesome!' }
]

export default function handler(req, res) {
  if (req.method === 'GET') {
    return { 
      posts,
      note: 'Add database integration for production use'
    }
  }
  
  if (req.method === 'POST') {
    // Add database creation logic here
    return res.status(501).json({ error: 'Add database integration for POST operations' })
  }
  
  return res.status(405).json({ error: 'Method not allowed' })
}