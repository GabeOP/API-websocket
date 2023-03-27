const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer,{cors: {origin: "*"}});

// Rota HTTP
// app.get('/', (req, res) => {
//   res.send('Bem-vindo à minha API!');
// });


// Evento de conexão na rota ADMIN
const admin = io.of("/admin");
admin.on("connection", socket =>{
  console.log("algm conectou na rota ADMIN " + socket.id)
})

// Evento de conexão na rota INICIO
const inicio = io.of("/inicio")
inicio.on('connection', (socket) => {
  console.log('Um usuário conectou na rota INICIO' + socket.id );
});

// Evento de conexão na rota SALA 1
const sala1 = io.of("/sala1");
sala1.on("connect", (socket)=>{
  console.log("um usuário conectou-se à sala 1")
  socket.on('chat message', (msg)=>{
    console.log(`${socket.id}: ${msg}`);
    sala1.emit('chat message', msg);
  })
})

httpServer.listen(3000, () => {
  console.log('listening on *:3000');
});
