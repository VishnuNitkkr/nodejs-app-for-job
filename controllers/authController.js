import userModel from "../models/userModel.js";

//register
export const registerController=async(req,res,next)=>{
   
  const {name,email,password,location}=req.body;

  //  if(!name||!email||!password){
  //   next("please provide all fields")
  //  }

  //  const existingUser=await userModel.findOne({email});
  //  if(existingUser){
  //   next('user already exists')
  //  }
  

   const user=await userModel.create({name,email,password,location})
   


  //token
  const token =user.createJWT();

   res.status(201).send({
    success:true,
    message:'user created successfully',
    user:{
      name:user.name,
      lastname:user.lastName,
      email:user.email,
      location:user.location
    },
    token
   })

};

//login

export const loginController=async(req,res,next)=>{
  const {email,password}=req.body;


  //validation
  if(!email||!password){
    next('please provide all fields')
  }
  const user=await userModel.findOne({email}).select("+password")

  if(!user){
   next('invalid username ')
  }


  //compare password
  const isMatch=await user.comparePassword(password);
  if(!isMatch){
    next('invalid password')
  }
  user.password=undefined;
  const token=user.createJWT();
  res.status(200).send({
    success:true,
    message:"login successfully",
    user,
    token,
  })
};

//logout
export const logoutController=async(req,res)=>{


};

