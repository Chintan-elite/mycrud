const express = require("express")
const router = express.Router()
const User =require("../model/users")
const multer = require("multer")

const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,"./uploads")
    },
    filename: function(req,file,cb){
        cb(null,file.fieldname+"_"+Date.now()+"_"+file.originalname)
    }
})

var upload = multer({
    storage:storage
}).single("image")


router.get("/",(req,resp)=>{

    User.find((err,users)=>{
        if(err){
            resp.json({message:err.message})
        }
        else{
            resp.render("index",{title:"homepage",users:users})
        }
    })
   
})

router.get("/add",(req,resp)=>{
    resp.render("add_users",{title:"Add user"})
})

router.post("/adduser",upload,(req,resp)=>{

    const user = new User({
        name : req.body.name,
        email : req.body.email,
        phone:req.body.phone,
        image : req.file.filename
    })

    user.save((err)=>{
        if(err)
        {
            resp.json({message:err.message,type:'danger'})
        }
        else{
            req.session.message={
                type:'success',
                message:"User added successfully"
            }
        }
        resp.redirect("/")
    })

})

module.exports=router