const errorMiddleware=(err,req,res,next)=>{
    console.log(err)
   const defaultError={
    statusCode:500,
    message:err
   } 
   
   //missing field error
   if(err.name=='ValidationError'){
    defaultError.statusCode=400
    defaultError.message=Object.values(err.errors).map((items)=>items.message).join(',')
   }
   
   //duplicate user
   if(err.code&&err.code===11000){
    defaultError.statusCode=400
    defaultError.message=`${Object.keys(err.keyValue)} Id already present, please login`
   }
   

   res.status(defaultError.statusCode).json({message:defaultError.message});
}

export default errorMiddleware