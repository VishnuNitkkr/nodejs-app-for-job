import express from 'express'
import userAuth from '../middlewares/authMiddleware.js';
import { createJobController, deleteJobController, getAllJobsController, jobStatsController, updateJobController } from '../controllers/jobController.js';


//router obj
const router=express.Router();

//routes
//create post
router.post('/create-job',userAuth,createJobController)

//get jobs
router.get('/get-job',userAuth,getAllJobsController)

//update jobs
router.put('/update-job/:id',userAuth,updateJobController)

//delete jobs
router.delete('/delete-job/:id',userAuth,deleteJobController)


//job-stats filter jobs
router.get('/job-stats',userAuth,jobStatsController)

export default router;