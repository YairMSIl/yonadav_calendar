const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
};

const server = http.createServer((req, res) => {
    // Parse URL to handle client-side routing (ignore query parameters for file lookup)
    const parsedUrl = require('url').parse(req.url);
    let pathname = `.${parsedUrl.pathname}`;

    // If root is requested, serve index.html
    if (pathname === './') {
        pathname = './index.html';
    }

    const extname = String(path.extname(pathname)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(pathname, (err, content) => {
        if (err) {
            // If the file is not found, serve index.html as a fallback for SPA routing
            if (err.code === 'ENOENT') {
                fs.readFile('./index.html', (err, content) => {
                    if (err) {
                        res.writeHead(500);
                        res.end('Sorry, an error occurred: ' + err.code);
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(content, 'utf-8');
                    }
                });
            } else {
                // For other errors, send a 500 response
                res.writeHead(500);
                res.end('Sorry, an error occurred: ' + err.code);
            }
        } else {
            // If the file is found, serve it
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log('Press Ctrl+C to quit.');
});