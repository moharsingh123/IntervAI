

import razorpay from "../services/razorpay.service.js";
import crypto  from 'crypto';
import User from '../models/user.model.js'
import payment from "../models/payment.model.js";



export const createOrder= async (req, res)=>{
    try {
        const {planId, amount, credits}= req.body;

        if (!amount || !credits) {
            return res.status(400).json({message: "Invalid Plan data  amount and credit are not fetch from the body"})

        }
        // options

        const options= {
            amount:amount *100, // convert to paise
            currency:"INR",
            receipt:`reciept${Date.now()}`    
        }

        const order = await razorpay.orders.create(options)

        await payment.create({
            userId:req.userId,  //  from isAuth 
            planId,
            amount,
            credits,
            razorpayOrderId: order.id,
            status:"created",

        })

        return res.json(order)
         

    } catch (error) {
        console.log("Failed to create the RazorPay order")
        return res.status(500).json({
            message:"failed to create the RazorPay order" , error
        })
    }
}

export const verifyPayment= async (req, res)=>{
    try {
        const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: 'Missing Razorpay payment parameters' });
        }

        const body = razorpay_order_id + '|' + razorpay_payment_id;

        const expectedSignature= crypto
            .createHmac("sha256" , process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex")

        if(expectedSignature !== razorpay_signature){
            return res.status(400).json({message:"Invalid payment signature"})
        }
        // signature match kar jata ha then 
        const paymentRecord = await payment.findOne({
            razorpayOrderId: razorpay_order_id
        })

        if (!paymentRecord) {
            return res.status(404).json({message:"Payment not found "})
        }

        if(paymentRecord.status=== "paid"){
            return res.json({message:"Already processed"});

        }

        // update payment record

        paymentRecord.status= "paid";
        paymentRecord.razorpayPaymentID=razorpay_payment_id;
        await paymentRecord.save();

        // add credits record

        const updateUser= await User.findByIdAndUpdate(paymentRecord.userId , {
            $inc:{credits :paymentRecord.credits}
        } , {new:true})

        res.json({
            success:true,
            message:"Payment verified and credits added",
            user:updateUser
        })

    } catch (error) {
        console.log("payment is not verified" ,error);
        return res.status(500).json({
            message: "failed to verify Razorpay Payment"
        })
        
    }
}