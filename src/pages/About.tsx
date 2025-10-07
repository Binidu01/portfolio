import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto my-12 p-10 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-indigo-700 mb-2">About Bini.js</h1>
        <p className="text-lg text-gray-600">Modern React framework built on Vite with file-based API routes</p>
      </div>
      
      <div className="p-6 bg-blue-50 border border-blue-100 rounded-lg my-8">
        <p className="text-gray-700 mb-4">
          Bini.js combines Vite's speed with React's simplicity, offering a Next.js-like 
          experience with faster builds, built-in API routes, and instant feedback.
        </p>
        <p className="text-gray-700">
          <strong>API Routes:</strong> File-based API routes in <code>src/api/</code> work in both development and production!
        </p>
        <p className="text-gray-700 mt-4">
          <strong>Database Ready:</strong> Easily add Firebase, MongoDB, or any database to your API routes when needed.
        </p>
      </div>

      <div className="text-center mt-8 pt-8 border-t border-gray-200">
        <Link 
          to="/" 
          className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg transition-transform hover:-translate-y-0.5"
        >
          ← Home
        </Link>
      </div>
    </div>
  );
}