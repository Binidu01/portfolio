# lasi-portfolio

⚡ Lightning-fast Bini.js app with file-based API routes.

## 🚀 Development

```bash
npm install
npm run dev
```

## 📦 Production 

```bash
npm run build
npm run start  # Opens vite preview (super fast!)
```

## 🌐 API Routes

File-based API routes (like Next.js):

```
src/api/
├── hello.js       → /api/hello
├── users.js       → /api/users  
├── database-example.js → /api/database-example
└── posts/
    ├── index.js   → /api/posts
    └── [id].js    → /api/posts/123
```

## 🎨 Styling: Tailwind

This project uses Tailwind CSS for styling.



## 🗄️ Database Integration

**Ready for Firebase, MongoDB, or any database!**

When you need real database operations:

1. **Install your database package**:
   ```bash
   npm install firebase  # for Firebase
   # or
   npm install mongodb   # for MongoDB
   ```

2. **Add environment variables** to `.env`:
   ```env
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   ```

3. **Update your API routes** - see `src/api/database-example.js` for reference

## 🎯 Features

- ⚡ Lightning-fast HMR with Vite
- 🔌 File-based API routes (like Next.js)
- 🗄️ Database-ready architecture
- 🎨 Tailwind support
- 📱 Responsive design

**All API routes work in both development and production!**

Built with Bini.js v7.0.6
