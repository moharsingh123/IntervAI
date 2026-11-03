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
const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:5173",
    "https://intervai-2-client-7n9q.onrender.com",
    "https://intervai-1-6oqp.onrender.com",
    "https://intervai-client-1azb.onrender.com"
].filter(Boolean);

app.use(cors({
    origin: function(origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        callback(new Error("Not allowed by CORS"));
    },
    credentials:true
}))

app.use(express.json()) // to parse the json data from the request body
app.use(cookieParser())

// routes  
app.use('/api/auth' ,authRouter)
app.use('/api/user' , userRouter)
app.use('/api/interview' , interviewRouter)
app.use('/api/payment' , paymentRouter)

const PORT=process.env.PORT || 5000;
const startServer = async () => {
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured");
        }

        await connectDb();
        app.listen(PORT, () => {
            console.log(`server is running on Port ${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error);
        process.exit(1);
    }
};

startServer();
