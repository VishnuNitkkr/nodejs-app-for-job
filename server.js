//api doc
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
//packages import
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import 'express-async-errors'
//security packages
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
//files import
import connectDB from './config/db.js';

//routs import
import testRoute from './routes/testRoute.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import jobsRoutes from './routes/jobsRoutes.js'
import errorMiddleware from './middlewares/errorMiddleware.js'


//dotenv config
dotenv.config();

//mongo db
connectDB()

// swagger api config
const options={
  definition:{
    openai:'3.0.0',
    info:{
      title:'Job-Portal Application',
      description:'Node express job portal application'
    },
    servers:[
      {
        url:"http://localhost:8080"
      }
    ]
  },
  apis:['./router*.js'],
  
};

const spec=swaggerJSDoc(options);

//rest object
const app=express();

//middlewares
app.use(helmet());
app.use(mongoSanitize());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());
app.use(morgan('dev'))

//routes
app.use('/',(req,res)=>{
  res.send("hello")
})
app.use('/api/v1/test',testRoute)
app.use('/api/v1/auth',authRoutes)
app.use('/api/v1/user',userRoutes)
app.use('/api/v1/job',jobsRoutes)

//home route
app.use('/api-doc',swaggerUi.serve,swaggerUi.setup(spec));

//error middlewqare
app.use(errorMiddleware)
// server listening
const port=process.env.PORT||8080;
app.listen(port,()=>{
  console.log(`server running on port no. ${port}`)
})
