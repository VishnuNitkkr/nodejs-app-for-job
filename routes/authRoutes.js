import express from 'express'
import { registerController, loginController, logoutController } from '../controllers/authController.js';

import  rateLimit  from 'express-rate-limit'

//ip limiter
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', 
	legacyHeaders: false, 
});


//router obj
const router=express.Router();


//routes

/** 
*  @swagger
* components:
*  schemas:
*    User:
*        type:object
*        required:
*          -name
*          -lastName
*          -email
*          -password
*          -location
*        properties:
*          id: 
*           type:string
            description:THe auto generated id of user  collection
          name: 
            type:string
            description:User name 
          lastName: 
            type:string
            description:user last name
          email: 
            type:string
            description:user email address
          password: 
            type:string
            description:user password should be greater than 6 chars
          location: 
            type:string
            description:user location city or country
        example:
          id:wgthyjjy5rtegrwfdadvfb
          name:test
          lastName:node
          email:test@test.com
          password:123456
          location:delhi
*/


/**
 * @swagger
 * tags:
 *   name:Auth
 *   description:authentication apis
 */

router.post('/register',limiter,registerController)
router.post('/login',limiter,loginController)


export default router;