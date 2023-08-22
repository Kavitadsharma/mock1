const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const { connection } = require("./db")
const {mediModel}=require("./appoint")
const {UserModel}=require("./user.model")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
require("dotenv").config()
const app=express()

app.use(express.json())
app.use(cors())

app.get("/",(req,res)=>{
res.send("home page")
})
//post
app.post("/signup",async(req,res)=>{
    const{email,pass,confirmpass}=req.body
    try{
        bcrypt.hash(pass,5,async(err,hash)=>{
            const user=new UserModel({email,pass:hash,confirmpass})
            await user.save()
            res.status(200).send({"msg":"registration has been done!"})
        })
    }catch(err){
        res.status(400).send({"msg":err.message})
    }
})
app.post("/login",async(req,res)=>{
    const {email,pass}=req.body
    try{
        const user=await UserModel.findOne({email})
        if(user){
            bcrypt.compare(pass,user.pass,(err,result)=>{
                if(result){
                    res.status(200).send({"msg":"login successfull!","token":jwt.sign({"userid":user._id},"masai")})
                }else{
                    res.status(400).send({"msg":"wrong credential"})
                }
            })
        }
    }catch(err){
        res.status(400).send({"msg":err.message})
    }
})









app.post('/appointment',async(req,res)=>{
    const {name,image,specialization,exp,location,date,slots,fee}=req.body
   
    try{
        const appointment= new mediModel({name,image,specialization,exp,location,date,slots,fee})
     
        await appointment.save()
        res.send(appointment)
        console.log("appointment added")
    }catch(error){
        res.send(error)
    }
})
app.get("/appointment",async(req,res)=>{
    try{
        const appointment= await mediModel.find()
        res.send(appointment)
    }catch(error){
        res.send(error)
    }
   
})
app.delete("/appointment/:id",async(req,res)=>{
    const id=req.params.id

    try{
        const deleted=await mediModel.findByIdAndDelete({_id:id})
        
        res.send("deleted appointment")

    }catch(error){
        res.send(error)
    }
})
app.put("/appointment/:id",async(req,res)=>{
    const id=req.params.id
    const payload = req.body
    try{
        const update=await mediModel.findByIdAndUpdate({_id:id},payload)
        res.send(update)
    } catch (error) {
        console.log(error)
    }
})

app.get("/sortdatebyDesc",async(req,res)=>{
    try{
        const appointment=await mediModel.find().sort({date:-1})
        res.send(appointment)
    }catch(error){
        res.send(error)
    }
})
app.get("/sortdatebyAesc",async(req,res)=>{
    try{
        const appointment=await mediModel.find().sort({date:1})
        res.send(appointment)
    }catch(error){
        res.send(error)
    }
})
app.get("/appointment/filter/:specialization",async(req,res)=>{
    const specialization=req.params.specialization
    try{
        const appointment=await mediModel.find({specialization:specialization})
        res.send(appointment)
    }catch(error){
        res.send(error)
    }
})
app.get ("/search/:name",async(req,res)=>{
    const name=req.params.name
    try{
        const doctors=await mediModel.find({name:name})
        res.send(doctors)
    }catch(error){
        console.log(error)
    }
})

app.listen(process.env.port,async()=>{
    try{
        await connection
        console.log("connected to db")
    
      
    }catch(err){
        console.log("error in db connection")
    }
    console.log("server is working")


})