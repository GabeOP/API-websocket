const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

const cors = require('cors')
app.use(cors())

const bcrypt = require("bcrypt");


//==========Rota para CADASTRO==========//

//body-parser para analisar o corpo da requisição
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

const User = require("./model/User")


app.post('/cadastro', async(req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const {name, password} = req.body;

  const verificaUsuario = await User.findOne({name})
  if(verificaUsuario){
    return res.status(400).json({msg:"Usuário já cadastrado. Tente um nome diferente."})
  }

  const salt = await bcrypt.genSalt(10);
  const senhaCripto = await await bcrypt.hash(password, salt)

  const user = new User ({name, password: senhaCripto});
  
  try{

    await user.save();
    res.status(201).json({msg: "Usuário cadastrado com sucesso!"})
  }catch(error){
    console.log(error)
  }
});


//==========Rota para LOGIN==========//

app.post('/login', async(req,res)=>{
  res.header("Access-Control-Allow-Origin", "*");
  const { name, password }= req.body;

  const verificaUsuario = await User.findOne({name})

  if(!verificaUsuario){
    return res.status(404).json({msg: "Usuário não encontrado"})
  }
  
  const checaSenha = await bcrypt.compare(password, verificaUsuario.password)
  if(!checaSenha){
    return res.status(422).json({msg: "Senha incorreta."})
  }

  res.status(200).json({msg: "Login realizado com sucesso"})
});



async function procuraUsuario(name){
  const usuario = await User.findOne({name})

  return usuario.name;
}

//==========Parte do websocket==========/
const sala1 = io.of("/sala1");
sala1.on("connect", (socket) => {
  console.log("Um usuário conectou-se à sala 1");
  socket.on("chat message", (msg) => {
    console.log(`${msg}`);
    sala1.emit("chat message", msg);
  });

})

//==========Evento de conexão na rota SALA 1==========//


const connectDb = require("./data/db");
connectDb();

httpServer.listen(3000, () => {
  console.log("Rodando na porta 3000");
});
