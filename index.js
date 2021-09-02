// import needed 
const http = require ('http');
const app = require('./app')





// port to be used 
const port = process.env.PORT || 3000 ; 

const server = http.createServer(app) ; 
server.listen(port) ; 
