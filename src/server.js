const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

//body-parser para analisar o corpo da requisição
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

const User = require("./model/User")
// Rota HTTP
app.post('/cadastro', async(req, res) => {
  const {name, password} = req.body;
  const user = new User ({name: name, password:password});
  
  try{
    await user.save();
  }catch(error){
    console.log(error)
  }
  res.redirect("http://127.0.0.1:5500/sala1/sala1.html")
});


// Evento de conexão na rota SALA 1
const sala1 = io.of("/sala1");
sala1.on("connect", (socket) => {
  console.log("Um usuário conectou-se à sala 1");
  socket.on("chat message", (msg) => {
    console.log(`${msg}`);
    sala1.emit("chat message", msg);
    
  });

});

const connectDb = require("./data/db");
connectDb();

httpServer.listen(3000, () => {
  console.log("Rodando na porta 3000");
});
