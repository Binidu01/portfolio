import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import os from 'os'

const BINIJS_VERSION = "7.0.6";
const PORT = 3000;

function getNetworkIp() {
  const interfaces = os.networkInterfaces();
  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

function showBiniBanner(mode) {
  const localIp = getNetworkIp();
  const isDev = mode === 'dev';
  
  console.log('');
  console.log('  ▲ Bini.js v' + BINIJS_VERSION);
  console.log('  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('    → Local:   http://localhost:' + PORT);
  console.log('    → Network: http://' + localIp + ':' + PORT);
  console.log('  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
}

// Badge injection plugin for development mode
function biniBadgePlugin() {
  return {
    name: 'bini-badge-injector',
    
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        // Only inject in development
        if (process.env.NODE_ENV !== 'production') {
          const badgeScript = `
            <style>
              .bini-dev-badge {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #111;
                color: #fff;
                padding: 10px 20px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: bold;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 9999;
                font-family: system-ui, -apple-system, sans-serif;
                user-select: none;
                pointer-events: none;
              }
            </style>
            <script>
              (function() {
                window.addEventListener('DOMContentLoaded', function() {
                  const badge = document.createElement('div');
                  badge.className = 'bini-dev-badge';
                  badge.textContent = '▲ Bini.js v7.0.6';
                  document.body.appendChild(badge);
                });
              })();
            </script>
          `;
          
          return html.replace('</body>', badgeScript + '</body>');
        }
        return html;
      }
    }
  }
}

function apiPlugin() {
  let isProduction = false
  
  return {
    name: 'api-plugin',
    
    config(config, { command }) {
      isProduction = command === 'build'
    },
    
    configureServer(server) {
      showBiniBanner('dev');
      
      server.middlewares.use('/api', async (req, res) => {
        try {
          const url = new URL(req.url, `http://${req.headers.host}`)
          const routePath = url.pathname.replace('/api/', '') || 'index'
          
          // Look for API handler - ONLY .js files
          const apiDir = path.join(process.cwd(), 'src/api')
          const possibleFiles = [
            path.join(apiDir, `${routePath}.js`),
            path.join(apiDir, routePath, 'index.js')
          ]
          
          let handlerPath = null
          for (const filePath of possibleFiles) {
            if (fs.existsSync(filePath)) {
              handlerPath = filePath
              break
            }
          }
          
          if (!handlerPath) {
            res.statusCode = 404
            res.end(JSON.stringify({ error: 'API route not found' }))
            return
          }
          
          // Convert Windows path to file:// URL for ESM imports
          const handlerUrl = pathToFileURL(handlerPath).href
          
          // Import the JavaScript handler
          const handlerModule = await import(handlerUrl)
          const handler = handlerModule.default
          
          if (typeof handler !== 'function') {
            res.statusCode = 500
            res.end(JSON.stringify({ error: 'Invalid API handler' }))
            return
          }
          
          // Parse request body
          let body = {}
          if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
            body = await new Promise((resolve) => {
              let data = ''
              req.on('data', chunk => data += chunk)
              req.on('end', () => {
                try {
                  resolve(JSON.parse(data || '{}'))
                } catch {
                  resolve({})
                }
              })
            })
          }
          
          // Create request object
          const request = {
            method: req.method,
            url: req.url,
            headers: req.headers,
            body,
            query: Object.fromEntries(url.searchParams)
          }
          
          // Create response object
          const response = {
            status: (code) => {
              res.statusCode = code
              return response
            },
            json: (data) => {
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(data, null, 2))
            },
            send: (data) => {
              res.end(data)
            }
          }
          
          // Execute handler
          const result = await handler(request, response)
          if (result && !res.writableEnded) {
            response.json(result)
          }
          
        } catch (error) {
          console.error('API Error:', error)
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'Internal Server Error' }))
        }
      })
    },
    
    configurePreviewServer(server) {
      showBiniBanner('preview');
      
      // Same logic for preview mode
      server.middlewares.use('/api', async (req, res) => {
        try {
          const url = new URL(req.url, `http://${req.headers.host}`)
          const routePath = url.pathname.replace('/api/', '') || 'index'
          
          const apiDir = path.join(process.cwd(), 'src/api')
          const possibleFiles = [
            path.join(apiDir, `${routePath}.js`),
            path.join(apiDir, routePath, 'index.js')
          ]
          
          let handlerPath = null
          for (const filePath of possibleFiles) {
            if (fs.existsSync(filePath)) {
              handlerPath = filePath
              break
            }
          }
          
          if (!handlerPath) {
            res.statusCode = 404
            res.end(JSON.stringify({ error: 'API route not found' }))
            return
          }
          
          // Convert Windows path to file:// URL
          const handlerUrl = pathToFileURL(handlerPath).href
          
          const handlerModule = await import(handlerUrl)
          const handler = handlerModule.default
          
          if (typeof handler !== 'function') {
            res.statusCode = 500
            res.end(JSON.stringify({ error: 'Invalid API handler' }))
            return
          }
          
          let body = {}
          if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
            body = await new Promise((resolve) => {
              let data = ''
              req.on('data', chunk => data += chunk)
              req.on('end', () => {
                try {
                  resolve(JSON.parse(data || '{}'))
                } catch {
                  resolve({})
                }
              })
            })
          }
          
          const request = {
            method: req.method,
            url: req.url,
            headers: req.headers,
            body,
            query: Object.fromEntries(url.searchParams)
          }
          
          const response = {
            status: (code) => {
              res.statusCode = code
              return response
            },
            json: (data) => {
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(data, null, 2))
            }
          }
          
          const result = await handler(request, response)
          if (result && !res.writableEnded) {
            response.json(result)
          }
          
        } catch (error) {
          console.error('Preview API Error:', error)
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'Internal Server Error' }))
        }
      })
    }
  }
}

export default defineConfig({
  plugins: [react(), biniBadgePlugin(), apiPlugin()],
  server: { 
    port: PORT, 
    open: true,
    host: true
  },
  preview: {
    port: PORT,
    open: true,
    host: true
  },
  build: { 
    outDir: 'dist'
  }
})