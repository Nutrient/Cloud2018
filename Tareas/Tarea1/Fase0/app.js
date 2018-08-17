const http = require('http');

const server = http.createServer((req, res) =>{
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.end("Hello World\n");
})

server.listen(8000, () => {
  console.log("http server running at port 8000");
})
