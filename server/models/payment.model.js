
import{ mongoose , Schema } from "mongoose";


const paymentSchema = new Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
    },
    planId:String,
    amount:Number,
    credits:Number,
    razorpayOrderId:String,
    razorpayPaymentID:String,
    status:{
        type:String,
        enum:["created" ,"paid","failed"],
        default:"created"
    },



},{timestamps:true})


const payment= mongoose.model("Payment" , paymentSchema)

export  default payment;