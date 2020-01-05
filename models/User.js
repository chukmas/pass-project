const mongoose = require("mongoose")

const User = new mongoose.Schema({

  name:{type:String, default:"", required:true},
  email:{type:String, default:"", required:true},
  password:{type:String, default:"", required:true},
  date:{type:Date, default: Date.now},

})

module.exports = mongoose.model("User", User)