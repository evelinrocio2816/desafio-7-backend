
const mongoose = require("mongoose");
const configObject= require("../config/config.js")
const {mongo_url} = configObject;


 mongoose.connect(mongo_url)
.then(()=> console.log("Conexion Exitosa"))
.catch((error)=>console.log("Error de conexion", error))