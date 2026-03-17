import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { motion } from "motion/react";
import { HiSparkles } from "react-icons/hi";
import { BsMicFill } from "react-icons/bs";
import { BsClockFill } from "react-icons/bs";
import { BsBarChartFill } from "react-icons/bs";
import { BsFileEarmarkTextFill } from "react-icons/bs";
import { GiRobotGolem } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import AuthModel from "../components/AuthModel";
import evalImg from '../assets/ai-ans.png'
import hrImg from '../assets/HR.png';
import techImg from '../assets/tech.png';
import creditImg from '../assets/credit.png';
import resumeImg from '../assets/resume.png';
import pdgImg  from '../assets/PDF.png';
import analyticsImg from '../assets/history.png';
import confidenceImg from '../assets/confi.png';
import Footer from "../components/Footer";



const Home = ()=>{
    const [showAuth , setShowAuth]= useState(false);
    const navigate= useNavigate()

    const {userData}= useSelector((state)=>state.user)
    return(
        <div className="min-h-screen bg-white flex  flex-col ">
           <Navbar/>

            <div className="flex-1 px-6 py-20">
             <div className="max-w-6xl mx-auto">
                <div className="flex justify-center mb-6">
                    <div className="bg-gray-100 text-green-600 text-sm px-4 py-2 
                    rounded-full flex items-center gap-2">
                        < HiSparkles size={16} className="bg-red-50 text-pink-600"/>
                        AI Powered Smart Interview Platform 
                    </div>
                </div>
                {/* Heading and contain the button */}
                <div className="text-center mb-28">
                        <motion.h1 
                        initial={{opacity:0, y:30}}
                        animate={{opacity:1, y:0}}
                        transition={{duration:0.6}}
                        className="text-4xl md:text-6xl font-semibold leading-tight max-w-4xl mx-auto">
                            Practice Interview with
                            <span className="relative inline-block">
                                <span className="bg-pink-100 text-pink-600 px-5 py-1 rounded-full">
                                    AI Intelligence 
                                </span>
                            </span>
                        </motion.h1>
                       <motion.p
                        initial={{opacity:0}}
                        animate={{opacity:1}}
                        transition={{duration:0.8}}
                        className="text-pink-500 mt-6 max-w-2xl mx-auto text-lg"
                       >
                        Role-based mock interviews with smart follow-ups,
                        adaptive difficulty and real time performance evaluation.
                       </motion.p>
                       {/* button */}
                       <div className="flex  flex-wrap justify-center gap-4 mt-10">
                        <motion.button
                            onClick={()=>{
                                if(!userData){
                                    setShowAuth(true)
                                    return
                                }
                                navigate('/interview')
                            }}
                            whileHover={{opacity:0.9 , scale:1.04}}
                            whileTap={{opopacity:1 , scale:0.94}}
                            className="bg-black text-white px-10 py-3 rounded-full 
                            hover:opacity-90 transition shadow-md"
                        >
                            Start Interview
                        </motion.button>
                        
                        <motion.button
                            onClick={()=>{
                                if(!userData){
                                    setShowAuth(true)
                                    return
                                }
                                navigate('/history')
                            }}
                            whileHover={{opacity:0.9 , scale:1.04}}
                            whileTap={{opopacity:1 , scale:0.94}}
                            className="border border-gray-300 px-10 py-3 rounded-full
                            hover:bg-gray-100 transition"
                        >
                            View History
                        </motion.button>
                       </div>
                </div>
                {/* Card */}
                <div className="flex flex-col md:flex-row
                 justify-center items-center gap-10 mb-28" >
                    {
                        [
                            {
                                icon:<GiRobotGolem/>,
                                step:"STEP 1",
                                tittle:"Role & Experience Selection",
                                desc:"AI adjust difficulty based on selected job role"
                            },
                            {
                                icon:<BsMicFill/>,
                                step:"STEP 2",
                                tittle:"Smart Voice Interview",
                                desc:"Dynamic follow-up question based on your answer"
                            },
                            {
                                icon:<BsClockFill/>,
                                step:"STEP 3",
                                tittle:"Timer Based Simulation",
                                desc:"Real interview pressure with time tracking."
                            }
                        ].map((item , index)=>(
                            <motion.div key={index}
                             initial={{opacity:0, y:60}}
                             whileInView={{opacity:1, y:0}}
                             transition={{duration:0.6 + index*0.2}}  
                             whileHover={{rotate:0, scale:1.06}}           
                             className={`
                            relative  bg-white rounde-3xl border-2 border-green-100
                            hover:border-pink-500 p-10 w-80 max-w-[90%] shadow-md
                            hover:shadow-2xl
                            transition-all duration-300
                            ${index===0?"rotate-[-4deg]" :""}
                            ${index===1?"rotate-[-3deg]  md:-mt-6 shadow-xl" :""}
                            ${index===2?"rotate-[-3deg]" :""}
                            `}>
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white
                            border-2 border-red-500 text-red-600 w-16 h-16 rounded-2xl flex items-center 
                            justify-center shadow-lg ">
                                {item.icon}
                            </div>
                            <div className="pt-10 text-center">
                                <div className="text-xs text-blue-600 font-semibold mb-2 tracking-wider">{item.step}</div>
                                <h3 className="font-semibold mb-3 text-lg">{item.tittle}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                            </div>


                            </motion.div>
                        ))
                    }
                </div>

                <div className="mb-32">
                    <motion.h3
                    initial={{opacity:0, y:20}}
                    whileInView={{opacity:1, y:0}}
                    transition={{duration:0.6}}
                    className="text-4xl font-semibold text-center mb-16"
                    >
                        Advanced AI{" "}
                        <span className="text-red-600">Capabilities</span>

                    </motion.h3>

                    <div className="grid md:grid-cols-2 gap-10">
                        {
                            [
                                {
                                    image:evalImg,
                                    icon:<BsBarChartFill/>,
                                    tittle:"AI Answer Evaluation",
                                    desc:"Scores communication, technical accuracy and confidence."
                                },
                                {
                                    image:resumeImg,
                                    icon:<BsFileEarmarkTextFill/>,
                                    tittle:"Resume Based Interview",
                                    desc:"Project-specifies question based on upload resume."
                                },
                                {
                                    image:pdgImg,
                                    icon:<BsFileEarmarkTextFill/>,
                                    tittle:"Download Pdf Report",
                                    desc:"Detailed strengths, weakness  and improvement insights ."
                                },
                                {
                                    image:analyticsImg,
                                    icon:<BsBarChartFill/>,
                                    tittle:"History & Analytics",
                                    desc:"Track progress with performance graphs and topic analysis."
                                }
                            ].map((item, index)=>(
                                <motion.div key={index}
                                 initial={{opacity:0, y:30}}
                                whileInView={{opacity:1, y:0}}
                                transition={{duration:0.5 , delay: index*0.1}}  
                                whileHover={{scale:1.02}}  
                                 className="bg-white border border-pink-400 
                                rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all">
                                    <div className="flex flex-col md:flex-row items-center gap-8">
                                        <div className="w-full md:w-1/2 flex justify-center">
                                        <img src={item.image} alt={item.tittle}
                                        className="w-full h-auto object-contain max-h-64"
                                        />
                                        </div>
                                        <div className="w-full md:w-1/2" >
                                            <div className="bg-blue-50 text-blue-600 w-12 h-12
                                            rounded-xl flex items-center justify-center mb-6">
                                                {item.icon}
                                            </div>
                                            <h3 className="font-semibold mb-3 text-lg">{item.tittle}</h3>
                                            <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>

                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        }
                    </div>
                </div>
                
                <div className="mb-32">
                    <motion.h3
                    initial={{opacity:0, y:20}}
                    whileInView={{opacity:1, y:0}}
                    transition={{duration:0.6}}
                    className="text-4xl font-semibold text-center mb-16"
                    >
                        Multiple Interview{" "}
                        <span className="text-red-600">Modes</span>

                    </motion.h3>

                    <div className="grid md:grid-cols-2 gap-10">
                        {
                            [
                                {
                                    image:hrImg,
                                    
                                    tittle:"HR Inerview Mode",
                                    desc:"Behavioral and communication based evaluation"
                                },
                                {
                                    image:techImg,
                                    
                                    tittle:"Technical Mode",
                                    desc:"Deep technical question based on selected role."
                                },
                                {
                                    image:confidenceImg,
                                    tittle:"Confidence Detection",
                                    desc:"Based tone and voice analysis insights"
                                },
                                {
                                    image:creditImg,
                                    tittle:"Credit System",
                                    desc:"Unlock premium interview sessions  easily"
                                }
                            ].map((mode, index)=>(
                                <motion.div key={index}
                                 initial={{opacity:0, y:30}}
                                whileInView={{opacity:1, y:0}}
                                transition={{duration:0.5 , delay: index*0.1}}  
                                whileHover={{y:-6}}  
                                 className="bg-white border border-pink-400 
                                rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all">
                                    <div className="flex items-center justify-between  gap-6">
                                        <div className="w-1/2">
                                            <h3 className="font-semibold text-xl mb-3"> {mode.tittle}</h3>
                                            <p className="text-gray-500 text-sm leading-relaxed"> {mode.desc}</p>
                                        </div>
                                        {/* Right Image */}
                                        <div className="w-1/2 flex justify-end">
                                        <img src={mode.image} alt={mode.tittle}
                                        className="w-28 h-28 object-contain"
                                         />
                                        </div>    
                                    </div>
                                </motion.div>
                            ))
                        }
                    </div>
                </div>

            </div>

            </div>
            {showAuth && <AuthModel onClose={()=>setShowAuth(false)} /> }
                <Footer/>
            

        </div>
    )
}
export default Home;