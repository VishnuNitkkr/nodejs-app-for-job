import moment from "moment";
import jobsModal from "../models/jobsModal.js";
import mongoose  from 'mongoose';

export const createJobController=async(req,res,next)=>{
  const {company,position}=req.body;
  if(!company||!position){
    next('please provide all fields');
  }
  req.body.createdBy=req.user.userId;
  const job=await jobsModal.create(req.body);
  res.status(200).json({job})
}


// get job controller
export const getAllJobsController=async(req,res,next)=>{
 const {status,workType,search,sort}=req.query;

 //condition for searching
 const queryObject={
    createdBy:req.user.userId
 }
  //logic filters
  if(status&&status!='all'){
    queryObject.status=status;
  }
  if(workType&&workType!='all'){
    queryObject.workType=workType;
  }

  if(search){
    queryObject.position={$regex:search,$options:'i'}
  }

  let queryResult=jobsModal.find(queryObject)

  //sorting
  if(sort==='latest'){
    queryResult=queryResult.sort('-createdAt');
  }
  if(sort==='oldest'){
    queryResult=queryResult.sort('createdAt');
  }
  if(sort==='a-z'){
    queryResult=queryResult.sort('position');
  }
  if(sort==='z-a'){
    queryResult=queryResult.sort('-position');
  }

  //pagination
  const page=Number(req.query.page)||1
  const limit=Number(req.query.limit)||10
  const skip=(page-1)*limit;

  queryResult=queryResult.skip(skip).limit(limit);

  //jobs count
  const totalJobs=await jobsModal.countDocuments(queryResult);
  const numOfPage=Math.ceil(totalJobs/limit);

  const jobs= await queryResult; 
  //const jobs=await jobsModal.find({createdBy:req.user.userId})

  res.status(200).json({
    totalJobs,
    jobs,
    numOfPage
  })
}

//update-job controller

export const updateJobController=async(req,res,next)=>{
  const {id}=req.params;
  const {company,position}=req.body;

  if(!company||!position)
  {
    next("please provide all fields")
  }

  //find job
  const job =await jobsModal.findOne({_id:id})

  //validation
  if(!job){
    next(`no jobs found with this id ${id}`)
  }

   if(!req.user.userId===job.createdBy.toString()){
      next("you are not authorized to update this job")
      return
   }

   const updateJob=await jobsModal.findOneAndUpdate({_id:id},req.body,{
    new:true,
    runValidators:true
   })

   res.status(200).json({updateJob});
}



////delete jobs
export const deleteJobController=async(req,res,next)=>{
  const {id}=req.params;

  //find job
  const job=await jobsModal.findOne({_id:id})

  //validation
  if(!job){
    next(`No job found with this id ${id}`)
  }

  if(!req.user.userId===job.createdBy.toString()){
    next('you are not authorized to delete this job')
    return
  }
  
  await job.deleteOne();

  res.status(200).json({message:'job deleted successfully'})
}



//get job stats

export const jobStatsController=async(req,res)=>{
  const stats=await jobsModal.aggregate([
   //search by user job
    {
      $match:{
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
     
    },
    {
      $group:{
        _id:'$status',count:{$sum:1}
      },
    }
  ])
  //default stats
  const defaultStats={
    pending:stats.pending||0,
    reject:stats.reject||0,
    interview:stats.interview||0
  }

  //monthly yearly stats
  let monthlyApplications=await jobsModal.aggregate([
    {
      $match:{
        createdBy:new mongoose.Types.ObjectId(req.user.userId)
      },
    },
    {
      $group:{
        _id:{
          year:{$year:"$createdAt" },
          month:{$month:'$createdAt'}
        },
        count:{
          $sum:1,
        }
      }
    }
  ])

  monthlyApplications=monthlyApplications.map((item)=>{
    const {_id:{year,month},count}=item;
    const date=moment().month(month-1).year(year).format('MMM Y');
    return {date, count}
  }).reverse();
  res.status(200).json({
    totalJobs:stats.length,
    defaultStats,monthlyApplications})
}