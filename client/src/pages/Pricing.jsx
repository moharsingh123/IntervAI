import { m, scale } from 'motion/react';
import react, { useState } from 'react';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from "motion/react";
import axios  from 'axios';
import { ServerUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
const Pricing= ()=>{
    const navigate= useNavigate(); 
    const [selectedPlan , setSelectedPlan] = useState("free")
    const [loadingPlan , setLoadingPlan] = useState(null)
    const dispatch = useDispatch();
    const plans = [
        {
            id:"free",
            name:"Free",
            price:0,
            credits:100,
            description:"Perfect for beginners starting interview preparation.",
            features:  [
                "100 AI Interview Credits",
                "Basic Performance Report",
                "Voice Interview Access",
                "Limited History Tracking",
            ],
            default:true,
        },
        {
            id:"basic",
            name:"Starter Pack",
            price:100,
            credits:150,
            description:" Great  for focused practice and improvement.",
            features: [
                "150 AI Interview Credits",
                "Detailed Feedback",
                "performance Analytics",
                "Full Interview History",
            ]
            
        },
        {
            id:"pro",
            name:"Pro Pack",
            price:500,
            credits:650,
            description:"Best value for serious job preparation.",
            features: [
                "650 AI Interview Credits",
                "Advanced AI Feedback",
                "Skill Trend Analytics",
                "priority AI processing",
            ],
            badge:"Best Value"
            
        },

    ];

    const handlePayment= async (plan)=>{
        try {
            setLoadingPlan(plan.id)
            const amount =
                plan.id=== "basic" ?100:
                plan.id === "pro" ?500 :0;

            const result = await axios.post(ServerUrl + '/api/payment/order',{
                planId:plan.id,
                amount:amount,
                credits:plan.credits

            }, {withCredentials:true})
            console.log(result.data);

            // to take the response

            const option = {
                key:import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount:result.data.amount,
                currency:"INR",
                name:"IntervAI",
                description:`${plan.name} - ${plan.credits} Credits`,
                order_id: result.data.id,

                handler: async (response)=>{
                    const verifyPay = await axios.post(
                        ServerUrl + '/api/payment/verify',
                        {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                        },
                        { withCredentials: true }
                    );

                    dispatch(setUserData(verifyPay.data.user));
                    alert('Payment Successful Credits Added!');
                    navigate('/');
                },

                theme:"#F472B6",

            }

            // open the razor pay 

            const rzp= new window.Razorpay(option) 
            rzp.open()
            setLoadingPlan(null)
        } catch (error) {
            console.log(" handlePayment is not working  Pricing.jsx "+error)
            setLoadingPlan(null)
            
        }

    }
    return(
        <div className='min-h-screen bg-gradient-to-br from-gray-50 to-pink-50 py-16 px-6'>
                {/* Header */}
            <div className='max-w-6xl mx-auto mb-14 flex items-start gap-4'>

                <button onClick={()=>navigate('/')} className='mt-3 p-3 rounded-full bg-white shadow hover:shadow-md transition'>
                    <FaArrowLeft className='text-gray-700'/>    
                </button>

                <div className='text-center w-full'>
                    <h1 className='text-4xl font-bold text-pink-800'>
                        Choose Your Plan 
                    </h1>
                    <p className='text-pink-500 mt-3 text-lg'>
                        Flexible pricing to match your interview perparation goals
                    </p>

                </div>
                        
            </div>


            {/* cards  */}

            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto'>
                {plans.map((plan)=>{
                    const isSelected=  selectedPlan=== plan.id;
                    return (
                        <motion.div
                        key={plan.id}
                        whileHover={!plan.default && {scale:1.03}}
                        onClick={()=> !plan.default && setSelectedPlan(plan.id)}

                        className={`
                            relative rounded-3xl p-8 transition-all duration-300 
                            border${
                                isSelected ?"border-pink-600 shadow-2xl bg-white"
                                :"border-gray-200 bg-white shadow-md"
                            }
                            ${plan.default? "cursor-default" :"cursor-pointer"}
                            `}
                        >
                            {/* Badge */}

                            {plan.badge && (
                                <div className='absolute top-6 right-6 bg-pink-600 py-1  text-white
                                text-xs px-3 rounded-full'>
                                    {plan.badge}
                                </div>
                            )   }
                            {/*  Default Tag */}
                            {plan.default && (
                                <div className="absolute top-6 right-6 bg-pink-200 text-gray-700 text-xs px-3 py-1 rounded-full">
                                    Default

                                </div>
                            )}
                            {/* Plan Name */}
                             <h3 className='text-xl font-semibold text-pink-800'> 
                                { plan.name}
                            </h3>

                            {/* price */}

                            <div className='mt-4'>
                                <span className='text-xl font-bold text-red-600'>
                                    {plan.price}
                                </span>

                                <p className='text-gray-500 mt-1'>
                                    {plan.credits} Credits
                                </p>

                            </div>
                            {/* Description */}

                            <p className='text-gray- mt-4 text-sm leading-relaxed'>
                                {plan.description}

                            </p>
                            
                            {/* Features */}

                            <div className='mt-6 space-y-3 text-left'>
                                {plan.features.map((feature, index)=>(
                                    <div key={index}
                                    className='flex items-center gap-3'
                                    >
                                    <FaCheckCircle className='text-pink-500 text-sm'/>
                                    <span className='text-gray-700 text-sm'> 
                                        {feature}
                                    </span>

                                    </div>

                                ))}

                            </div>
                            
                            {
                                !plan.default && 
                                    <button 
                                    disabled= {loadingPlan === plan.id}
                                    onClick={(e)=>{e.stopPropagation()
                                        if (!isSelected) {
                                            setSelectedPlan(plan.id)
                                            
                                        }else{
                                            handlePayment(plan)
                                        }
                                    }}
                                    className={`w-full mt-8 py-3 rounded-xl font-semibold transition
                                        ${
                                            isSelected?"bg-pink-600 text-white hover:opacity-90"
                                            : "bg-gray-200 text-gray-700 hover:bg-pink-50"
                                        }`}
                                    >
                                        {loadingPlan === plan.id?"Processing...." :isSelected?
                                            "Proceed to pay" :"Seleted Plan"}
                                    </button>
                            }

                            
                        </motion.div>
                    )
                })}
            </div>


             
        </div>
    )
}
export default Pricing;