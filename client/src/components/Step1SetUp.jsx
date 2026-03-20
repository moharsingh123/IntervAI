import React, { useState } from "react";

import { motion } from "motion/react";
import { FaUserTie,FaBriefcase} from "react-icons/fa6";
import { FaFileUpload, FaMicrophoneAlt, FaChartLine, FaArrowLeft } from "react-icons/fa";
import axios from 'axios';
import { ServerUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
const Step1SetUp = ({ onStart }) => {
    const userData = useSelector((state)=>state.user);
    const dispatch= useDispatch();
    const navigate= useNavigate();
   const [role , setRole]= useState("");
   const [experience , setExperience]= useState("");
   const [mode , setMode]= useState("Technical");
   const [resumeFile , setResumeFile]= useState(null);
   const [loading, setLoading]= useState(false);
   const [projects , setprojects]= useState([]);
   const [skills , setSkills]= useState([]);
   const [resumeText , setresumeText]= useState('');
   const [analysisDone , setAnalysisDone]= useState(false)
   const [analyzing , setAnalyzing]= useState(false)

   const handleUploadResume=  async()=>{
        if (!resumeFile || analyzing) {
            return;
        }
    setAnalyzing(true);
    const formData= new FormData()
    formData.append("resume" , resumeFile)
    try {
        const token = localStorage.getItem("token");
        if(!token){
            console.error("No auth token found in localStorage. Please login first.");
            setAnalyzing(false);
            return;
        }
        const result = await axios.post(ServerUrl + '/api/interview/resume', formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log(result.data);

        setRole(result.data.role || "")
        setExperience(result.data.experience || "")
        setprojects(result.data.projects || "")
        setSkills(result.data.skills || "")
        setresumeText(result.data.resumeText || "")
        setAnalysisDone(true);

        setAnalyzing(false)
    } catch (error) {
        // log full axios response if available
        console.error("Error in the StepSetUp", error);
        if (error.response) {
            console.error("Server response data:", error.response.data);
            console.error("Server status:", error.response.status);
        }
        setAnalyzing(false)
    }
   }

   const handleStart= async ()=>{
    setLoading(true);
    try {
        const token = localStorage.getItem("token");
        if(!token){
            console.error("No auth token found in localStorage. Please login first.");
            setLoading(false);
            return;
        }
        const result = await axios.post(ServerUrl + '/api/interview/generate-questions', {
            role, skills, experience, mode, resumeText, projects
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log(result.data);
        if (userData) {
            dispatch(setUserData({...userData, credits:result.data.creditsLeft}))
        }
        setLoading(false);
        onStart(result.data)
    } catch (error) {
        console.error("failed to  handle the fetch route")
        console.log(error);
        setLoading(false);
    }
   }
    return (



        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen flex items-center justify-center
            bg-gradient-to-br from-gray-100 to-gray-200 px-4"
            >
                    {/* ✅ Back Button (Top Left of Page) */}
                <button
                    onClick={() => navigate('/')}
                    className="absolute top-6 left-6 p-3 rounded-full bg-white shadow hover:shadow-md transition"
                >
                    <FaArrowLeft size={20} className="text-red-600" />
                </button>

                                    {/* <div className='mb-10 w-full flex items-start gap-4 flex-wrap'>

                        <button 
                        //  navigate to home page 
                        onClick={()=>navigate('/')}
                        className='mt-1 p-3 rounded-full bg-white shadow hover:shadow-md transition  flex-nowrap'>
                            < FaArrowLeft size={20} className='text-red-600'/>
                        </button>

                        <div>
                            <h1 className='text-3xl font-bold text-red-800'>
                                Interview 
                            </h1>

                            <p className='text-red-500 mt-2'>
                                 Preparation makes Performance  Better
                            </p>
                        </div>

                    </div> */}


            <div className="w-full max-w-6xl bg-white rounded-3xl mt-1
              shadow-2xl grid md:grid-cols-2 overflow-hidden">

            

                
                {/* left */}
                <motion.div
                    initial={{ x: -80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    className="relative bg-gradient-to-br from-pink-50 to-pink-100 
                    p-10 flex flex-col justify-center">


                    <h2 className="text-4xl font-bold text-red-800 mb-6">
                        Start Your AI Interview
                    </h2>
                    <p className="text-red-500 mb-10">
                        Practice real interview scenarios powered by AI.
                        Improve communication , technical skills and confidense.
                    </p>
                    {/* object array */}
                    <div className="space-y-5">
                        {
                            [
                                {
                                    icon:<FaUserTie className="text-pink-600 text-xl"/>,
                                    text:"Choose Role & Experience"
                                },
                                {
                                    icon:<FaMicrophoneAlt className="text-pink-600 text-xl"/>,
                                    text:"Smart Voice Interview"
                                },
                                {
                                    icon:<FaChartLine className="text-pink-600 text-xl"/>,
                                    text:"Performance Analytics"
                                },
                            ].map((item , index)=>(
                                <motion.div key={index} 
                                initial={{y:30, opacity:0}}
                                animate={{y:0, opacity:1}}
                                transition={{delay:0.2+ index*0.3}}
                                whileHover={{scale:1.03}}

                                className="flex items-center space-x-4
                                bg-white p-4 rounded-xl shadow-sm cursor-pointer"
                                >
                                    {item.icon}
                                    <span className="text-gray-700 font-medium">{item.text} </span>
                                 </motion.div>

                            ))
                        }
                    </div>

                </motion.div>

                {/* Right */}
                <motion.div
                initial={{x:80, opacity:0}}
                animate={{x:0 , opacity:1}}
                transition={{duration:0.7}}
                className="p-12 bg-white flex flex-col justify-center"
                >
                    <h2 className="text-3xl font-bold text-gray-800 mb-8">Interview SetUp</h2>
                    <div className="space-y-6">

                        <div className="relative">
                            <FaUserTie className="absolute top-4 left-4 text-pink-400"/>
                            <input type="text" placeholder="Enter Role"
                             className="w-full pl-12 pr-4 py-3 border border-gray-200
                             rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition"
                             onChange={(e)=>setRole(e.target.value)}
                             value={role}
                              />
                        </div>

                        <div className="relative">
                            <FaBriefcase className="absolute top-4 left-4 text-pink-400"/>
                            <input type="text" placeholder="Experience ( e.g. 2 years)"
                             className="w-full pl-12 pr-4 py-3 border border-gray-200
                             rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition"
                             onChange={(e)=>setExperience(e.target.value)}
                             value={experience}
                              />
                        </div>
                        <select value={mode}
                        onChange={(e)=>setMode(e.target.value)}
                        className="w-full py-3 px-4 border border-gray-200 rounded-xl 
                        focus:ring-2 focus:ring-pink-500 
                        outline-none transition"
                        > 
                            <option value="Technical">Technical Interview</option>
                            <option value="HR"> HR Interview</option>
                        </select>

                        {!analysisDone  && (
                            <motion.div
                            whileHover={{scale:1.02}}
                            onClick={()=>document.getElementById('resumeUpload').click()} 
                            className="border-2 border-dashed border-gray-300 
                            rounded-xl p-4 text-center cursor-pointer
                            hover:border-pink-500 hover:bg-green-50 transition">
                                <FaFileUpload className="text-4xl mx-auto text-pink-600 mb-3"/>
                                <input type="file"
                                  accept="application/pdf "
                                  id="resumeUpload"
                                  className="hidden"
                                  onChange={(e)=>setResumeFile(e.target.files[0])}/>

                                  <p className="text-gray-600 font-medium">
                                    {resumeFile ? resumeFile.name: "Click to upload resume(Optional)"}
                                  </p>
                                  {resumeFile && (
                                    <motion.button
                                    whileHover={{scale:1.02}}
                                    onClick={(e)=>{e.stopPropagation();
                                        handleUploadResume()}}
                                    className="mt-4 bg-gray-900 text-white px-5 py-2 
                                    rounded-lg hover:bg-gray-900 transition"
                                    >
                                        {analyzing ?" analyzin" :"Analyzing Resume" }
                                    </motion.button>
                                    )}
                            </motion.div>
                        )
                        }
                        {/*  agar  analizing done then show the skill and projects, role, experience  */}
                        { analysisDone && (
                            <motion.div 
                            initial={{opacity:0 , y:20}}
                            animate={{opacity:1 , y:0}}
                             className="bg-gray-50 border-gray-200 rounded-xl
                            p-5 space-y-4"
                            >
                                <h3 className="text-lg font-semibold text-red-800"> Resume Analysis Result</h3>
                                {projects.length>0 && (
                                    <div>
                                        <p className="font-medium text-pink-700  mb-1">
                                            Projects:
                                        </p>

                                        <ul className="list-disc list-inside text-gray-600 space-y-1" >
                                            {
                                                projects.map((p, i)=>(
                                                    <li key={i}>{p}</li>
                                                ))
                                            }

                                        </ul>
                                    </div>
                                )}

                                {skills.length>0 && (
                                    <div>
                                        <p className="font-medium text-pink-700  mb-1">
                                            Skills:
                                        </p>
                                        <ul className="flex flex-wrap gap-2" >
                                            {
                                                skills.map((s, i)=>(
                                                    <span key={i} className="bg-pink-100 
                                                    text-pink-600 px-3 py-1 rounded-full text-sm ">{s}</span>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                )}
                                
                            </motion.div>
                        )}

                        <motion.button
                        onClick={handleStart}
                            disabled={!role || !experience || loading}
                            whileHover={{scale:1.03}}
                            whileTap={{scale:0.95}}
                         className="w-full disabled:bg-gray-600 
                        bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-full text-lg font-semibold
                        transition duration-300 shadow-md">
                            { loading ? "Starting... " :  "Start Interview"}
                        </motion.button>



                    </div>
                </motion.div>

            </div>

        </motion.div>
    )
}
export default Step1SetUp;
