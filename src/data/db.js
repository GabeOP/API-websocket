const mongoose = require("mongoose");

const connectDb = () =>{
  mongoose.connect("mongodb+srv://admin:DCI3oAIKw2R5abjI@cluster0.0ibfqv1.mongodb.net/?retryWrites=true&w=majority")
  .then(()=> console.log("Conectado ao banco de dados!"))
  .catch((error)=> console.log(error))
}

module.exports = connectDb;