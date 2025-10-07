// Users API - Ready for Firebase/MongoDB integration
// Add your database logic here when needed

let users = [
  { id: 1, name: 'John Doe', email: 'john@bini.js' },
  { id: 2, name: 'Jane Smith', email: 'jane@bini.js' }
]

export default function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return {
        users,
        total: users.length,
        timestamp: new Date().toISOString()
      }
    
    case 'POST':
      const newUser = {
        id: users.length + 1,
        ...req.body,
        createdAt: new Date().toISOString()
      }
      users.push(newUser)
      return {
        user: newUser,
        message: 'User created successfully'
      }
    
    case 'PUT':
      // Add your update logic here
      return res.status(501).json({ error: 'Update not implemented - add your database logic' })
    
    case 'DELETE':
      // Add your delete logic here
      return res.status(501).json({ error: 'Delete not implemented - add your database logic' })
    
    default:
      return res.status(405).json({ error: 'Method not allowed' })
  }
}