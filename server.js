const http = require('http');
const PORT = process.env.rrPORT || 14123;
const system = require('child_process')

let inp = ""
let auth = process.env.auth || "1234"

const reset = () => {
    inp = ""
}

const server = http.createServer((req, res) => {
    //basic slave route
    if (req.url === '/' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(inp);
    }
    //master status route
    else if (req.url === '/status' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(inp);
    }
    //master instruct route 
    else if (req.url === '/instruct' && req.method === 'POST') {
        if (req.headers.auth !== auth) {
            res.statusCode = 401;
            res.end("Unauthorized");
        }
        else {
            reset() 
            req.on('data', c => inp += c)
            req.on('end', () => {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end("Your wish is my command");
            })
        }
    }
});

server.listen(PORT, () => {
    console.log(`Shell server running @${PORT}`);
});
