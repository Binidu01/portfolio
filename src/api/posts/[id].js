// Dynamic post route - Ready for database integration

let posts = [
  { id: 1, title: 'First Post', content: 'Hello world!' },
  { id: 2, title: 'Second Post', content: 'API routes are awesome!' }
]

export default function handler(req, res) {
  const postId = parseInt(req.query.id)
  const post = posts.find(p => p.id === postId)
  
  if (!post) {
    return res.status(404).json({ error: 'Post not found' })
  }
  
  if (req.method === 'GET') {
    return { post }
  }
  
  if (req.method === 'PUT') {
    // Add database update logic here
    return res.status(501).json({ error: 'Add database integration for update operations' })
  }
  
  if (req.method === 'DELETE') {
    // Add database delete logic here
    return res.status(501).json({ error: 'Add database integration for delete operations' })
  }
  
  return res.status(405).json({ error: 'Method not allowed' })
}