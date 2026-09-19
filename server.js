const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')

const root = __dirname
const port = Number(process.env.PORT || 3000)
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
}

const server = http.createServer((req, res) => {
  const requested = decodeURIComponent((req.url || '/').split('?')[0])
  const relative = requested === '/' ? 'index.html' : requested.replace(/^\/+/, '')
  const candidate = path.resolve(root, relative)
  const safePath = candidate.startsWith(root + path.sep) || candidate === path.join(root, 'index.html')
  const filePath = safePath && fs.existsSync(candidate) && fs.statSync(candidate).isFile() ? candidate : path.join(root, 'index.html')

  res.writeHead(200, { 'Content-Type': mime[path.extname(filePath)] || 'application/octet-stream' })
  fs.createReadStream(filePath).pipe(res)
})

server.listen(port, '0.0.0.0', () => {
  console.log(`Aethelis preview running on port ${port}`)
})
