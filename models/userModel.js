import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
//schema

const userSchema=new mongoose.Schema({
  name:{
        type:String,
        required:[true,'Name is required']
       },
   lastName:{
         type:String
         },    
  email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
        validate:validator.isEmail
         },  
  password:{
        type:String,
        required:[true,'Password is required'],
        minLength:[6,"password should be 6 characters"],
        select:true
       },
  location:{
        type:String,
        default:'mumbai'
       },     
         
},{timestamps:true})

//middleware
userSchema.pre('save',async function(){
  if(!this.isModified)return;
  const {genSalt}=bcrypt
  const salt=await bcrypt.genSalt(10);
  this.password=await bcrypt.hash(this.password,salt);

});

//jsonwebtoken
userSchema.methods.createJWT=function(){
  return jwt.sign({userId:this._id},process.env.JWT_SECRET,{expiresIn:'1d'});
}

// compare password
userSchema.methods.comparePassword=async function(userPassword){
   const isMatch=await bcrypt.compare(userPassword,this.password)
   return isMatch;
}

export default mongoose.model('User',userSchema);

 