const express = require("express");
const app =express()
const PORT = 8080;

const productsRouter = require("./routes/products.router.js");
const cartsRouter =require("./routes/carts.router.js")
const viewRouter = require("./routes/views.router.js")
const userRouter= require("./routes/user.router.js")
const sessionRouter=require("./routes/session.router.js")
const socket = require("socket.io");

require("./db/index.db.js")

const passport= require("passport")
const initializePassport= require("./config/passport.config.js")

const cookieParser=require("cookie-parser")

const session= require("express-session")

const FileStore =require("session-file-store")

const fileStore = FileStore(session)

const MongoStore = require("connect-mongo")


///////////////////////////////////////////////////////////////////HANDLEBARS//////////////////////////////////////////////////////////

const { engine, create} = require('express-handlebars');
//otras config handlebars
const hbs = create({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }
});
app.engine("handlebars", hbs.engine)
app.set("view engine","handlebars")
app.set("views", "./src/views")


///////////////////////////////////////////////////////////////////////MiDDLEWARE//////////////////////////////////////////////////////
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use(express.static("./src/public"))

app.use(cookieParser())



app.use(session({
  secret:"secretCoder",
  resave:true,
  saveUninitialized: true,

 // store: new fileStore({path:"./src/sessions", ttl: 50, retries: 1})

store: MongoStore.create({
  mongoUrl: "mongodb+srv://evelinrocio2816:Airbag2816@cluster0.sasvmwp.mongodb.net/e-commerce?retryWrites=true&w=majority",
 // ttl:100
})
}))
// Passport

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

///////////////////////////////////////////////////////////////////////////ROUTES//////////////////////////////////////////////////////
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/", viewRouter)
app.use("/api/users", userRouter)
app.use("/api/session",sessionRouter)


////////////////////////////////////////////////////////////////INICIO EL SERVIDOR//////////////////////////////////////////////////////

 const httpServer= app.listen(PORT, ()=>{
  console.log(`Escuchando en http://localhost:${PORT}`);
})
const MessageModel= require("./Dao/models/message.models.js")

const io =new socket.Server(httpServer);



io.on("connection",(socket) => {
  console.log("Nuevo usuario conectado");

  socket.on("message", async data => {
           await MessageModel.create(data)
     

    const messages = await MessageModel.find()
    io.sockets.emit("message", messages)
    
  
  })
 
})


 