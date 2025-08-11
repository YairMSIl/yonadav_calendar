const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
    // Sanitize and parse the URL
    let reqUrl = req.url.split('?')[0];
    if (reqUrl === '/') {
        reqUrl = '/index.html';
    }

    // Prevent directory traversal
    const safePath = path.normalize(reqUrl).replace(/^(\.\.[\/\\])+/, '');
    let filePath = path.join(__dirname, safePath);

    fs.exists(filePath, (exist) => {
        if (!exist) {
            // If the file doesn't exist, it might be a client-side route.
            // Serve index.html as a fallback.
            fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Server Error');
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content, 'utf-8');
            });
            return;
        }

        // If it's a directory, default to index.html
        if (fs.statSync(filePath).isDirectory()) {
            filePath = path.join(filePath, 'index.html');
        }

        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server Error');
            } else {
                const ext = path.extname(filePath);
                const contentType = MIME_TYPES[ext] || 'application/octet-stream';
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log('Press Ctrl+C to quit.');
});