const mongoose= require("mongoose")
const mongoosePaginate =require("mongoose-paginate-v2") 

const ProductSchema =new mongoose.Schema({
    title:{
        type: String,
        required: true,
       
    },
    description:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    image:{
        type:String,
    },
    code:{
        type:String,
        unique: true,
        required: true
    },
 stock:{
    type:Number,
    required:true
 },
 category:{
    type:String,
    required: true 
 },
 status:{
    type:Boolean,
    required: true
 },
})
ProductSchema.plugin(mongoosePaginate)
console.log(mongoosePaginate);
const ProductModels = mongoose.model("products", ProductSchema)
 
module.exports= ProductModels;