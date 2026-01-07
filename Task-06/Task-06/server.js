const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;

function serveFile(res, filePath, statusCode = 200) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    } else {
      res.writeHead(statusCode, { 'Content-Type': 'text/html' });
      res.end(data);
    }
  });
}

const server = http.createServer((req, res) => {
  let filePath = '';

  if (req.url === '/' || req.url === '/home') {
    filePath = path.join(__dirname, 'pages', 'home.html');
    serveFile(res, filePath, 200);

  } else if (req.url === '/about') {
    filePath = path.join(__dirname, 'pages', 'about.html');
    serveFile(res, filePath, 200);

  } else if (req.url === '/contact') {
    filePath = path.join(__dirname, 'pages', 'contact.html');
    serveFile(res, filePath, 200);

  } else {
    filePath = path.join(__dirname, 'pages', '404.html');
    serveFile(res, filePath, 404);
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
