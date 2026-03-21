// create the server
import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/connectDb.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import interviewRouter from './routes/iterview.route.js'
import paymentRouter from './routes/payment.route.js';
dotenv.config();
const app= express();
app.use(cors(
    {
        origin:"https://intervai-2-client-7n9q.onrender.com", // in production it should be the frontend url
        credentials:true

    }
))

app.use(express.json()) // to parse the json data from the request body
app.use(cookieParser())

// routes  
app.use('/api/auth' ,authRouter)
app.use('/api/user' , userRouter)
app.use('/api/interview' , interviewRouter)
app.use('/api/payment' , paymentRouter)

const PORT=process.env.PORT || 5000;
app.listen(PORT , ()=>{
    console.log(`server is running on Port ${PORT}`);
    connectDb();
})
