const mongoose=require("mongoose")
const medi=mongoose.Schema({
    name:String,
    image:String,
    specialization:String,
    exp:Number,
    location:String,
    date:String,
    slots:Number,
    fee:Number

})

const mediModel=mongoose.model("appointment",medi)


module.exports={mediModel}