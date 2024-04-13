import mongoose from 'mongoose'

const connectDB=async()=>{
  try {
    await mongoose.connect(process.env.MONGO_URL)

    console.log(`connected to mongodb`)
  } catch (error) {
    console.log(`Error in connecting mongodb => ${error}`)
  }
}

export default connectDB;