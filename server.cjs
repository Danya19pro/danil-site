// Локальный сервер без дополнительных библиотек. Запуск: node server.cjs
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const allowed = new Map([['/', 'index.html'], ['/index.html', 'index.html'], ['/styles.css', 'styles.css'], ['/script.js', 'script.js']]);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };
http.createServer((req, res) => {
  const file = allowed.get(new URL(req.url, 'http://localhost').pathname);
  if (!file || !['GET', 'HEAD'].includes(req.method)) { res.writeHead(404); res.end('Not found'); return; }
  fs.readFile(path.join(__dirname, file), (error, data) => {
    if (error) { res.writeHead(500); res.end('Cannot read file'); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)], 'Cache-Control': 'no-store' });
    res.end(req.method === 'HEAD' ? undefined : data);
  });
}).listen(4173, '127.0.0.1', () => console.log('Site ready: http://127.0.0.1:4173'));
