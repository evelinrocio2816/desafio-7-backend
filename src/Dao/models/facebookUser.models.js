const mongoose= require("mongoose")

const facebookUserSchema=mongoose.Schema({
   
    provider:{
        type: String,
        required: true
    },
    accountId:{
        type:String,
        required: true
    },
   
});

const UserModelfacebook = mongoose.model("userFacebook", facebookUserSchema);
module.exports = UserModelfacebook;