 const testPostController =async(req,res)=>{
const {name}=req.body;

res.status(200).send(`name is ${name}`)

}

export  {testPostController};

