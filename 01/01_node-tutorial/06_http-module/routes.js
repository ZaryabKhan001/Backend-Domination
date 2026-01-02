const http = require('http');
const port = 3000;

const server = http.createServer((req, res) => {
  const url = req.url;
  if (url === '/') {
    res.writeHead(200, { 'content-type': 'text/plain' });
    res.end('Welcome to Home Page');
  } else if (url === '/projects') {
    res.writeHead(200, { 'content-type': 'text/plain' });
    res.end('Welcome to Projects page');
  } else {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('Page not found');
  }
});

server.listen(port, () => {
  console.log(`Server is listening on Port:${port}`);
});
