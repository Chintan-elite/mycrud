require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const session = require("express-session")
const app = express()
 const PORT = process.env.PORT||9000

 mongoose.connect(process.env.DB_URI)
 const db = mongoose.connection;
 db.on('error',(error)=>{console.log(error)})
 db.once('open',()=>{console.log("db connected");})

 app.use(express.urlencoded({extended:false}))
 app.use(express.json())
app.use(session({
    secret :"my secret key",
    saveUninitialized:true,
    resave:false
}))

app.use((req,resp,next)=>{
    resp.locals.message=req.session.message;
    delete req.session.message;
    next()
})

app.use(express.static("uploads"))

//set templete engine
app.set("view engine","ejs")

//router prefix
app.use("",require("./routes/routes"))


 app.listen(PORT,(req,resp)=>{
    console.log("server running on port : "+PORT);
 })