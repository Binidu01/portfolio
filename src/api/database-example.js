// Example: How to add Firebase to your API routes
// Remove this file or use it as a reference

/*
// 1. Install Firebase: npm install firebase
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'

// 2. Add your Firebase config to .env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// 3. Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// 4. Use in your API handlers
export default async function handler(req, res) {
  try {
    switch (req.method) {
      case 'GET':
        const snapshot = await getDocs(collection(db, 'users'))
        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        return res.json({ users })
      
      case 'POST':
        const newUser = { ...req.body, createdAt: new Date().toISOString() }
        const docRef = await addDoc(collection(db, 'users'), newUser)
        return res.json({ id: docRef.id, ...newUser })
      
      case 'PUT':
        const { id, ...updateData } = req.body
        await updateDoc(doc(db, 'users', id), updateData)
        return res.json({ message: 'User updated' })
      
      case 'DELETE':
        await deleteDoc(doc(db, 'users', req.body.id))
        return res.json({ message: 'User deleted' })
      
      default:
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Database error:', error)
    return res.status(500).json({ error: 'Database operation failed' })
  }
}
*/

// Current implementation (in-memory)
let items = [{ id: 1, name: 'Example item' }]

export default function handler(req, res) {
  // Replace this with Firebase/MongoDB when ready
  return res.json({ 
    items,
    message: 'Replace with real database for production'
  })
}