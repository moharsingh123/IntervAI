import mongoose from "mongoose";


const connectDb=  async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log(" Databse is Connected  to the Mongodb")
    } catch (error) {
        console.log("Error connecting to the database" , error)
    }
}
export default connectDb;