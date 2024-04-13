import express from 'express'

import userAuth from '../middlewares/authMiddleware.js';
import { updateController } from './../controllers/userController.js';

//router obj
const router=express.Router();

//routes
router.put('/update-user',userAuth,updateController)

export default router