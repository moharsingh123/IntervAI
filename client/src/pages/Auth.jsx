import React from "react";
import { GiRobotGolem ,GiRobotAntennas  ,GiFlintSpark} from "react-icons/gi";
import { FcGoogle } from "react-icons/fc";

import { motion } from "motion/react"
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import { ServerUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
const Auth = ({isModel= false})=>{
         const dispatch = useDispatch()
        const  handleGoogleAuth= async ()=>{
                console.log("Google auth")
                try {
                  const response =   await signInWithPopup(auth , provider)
                  let ResponseUser = response.user
                  let name = ResponseUser.displayName
                  let email= ResponseUser.email 
                    // send this data to the backend server
                    const result = await axios.post(ServerUrl +"/api/auth/google",{
                        name,
                        email,
                    },
                    {withCredentials:true}
                    )
                  
                  console.log("FULL RESPONSE:", result);
                    console.log("DATA:", result.data);
                    if (result.data.success) {
                        console.log("TOKEN:" , result.data.token)
                   localStorage.setItem("token", result.data.token); // ✅ safe       
                    dispatch(setUserData(result.data.user))
                     }
                    
                } catch (error) {
                    console.log(error);
                    dispatch(setUserData(null))
                }
        }
    return(
        <div className={`w-full 
        ${isModel? "py-4" :"min-h-screen bg-[#f0f0f0] flex items-center justify-center px-6 py-20"}`}>
            <motion.div 
            initial={{opacity:0 , y:-50}}
            animate={{opacity:1 , y:0}}
            transition={{duration:0.5}}
            className={`w-full 
        ${isModel? "max-w-md p-8 rounded-3xl" :"min-w-lg p-12 rounded-[32px]"} bg-white shadow-2xl border border-gray-200`}>
                <div className="flex items-center justify-center mb-7 gap-3">
                    <div className="bg-black text-white p-2 rounded-lg" >
                        {/*  icon  */}
                      <GiRobotGolem size={20} />
                    </div>
                    <h2 className="font-semibold text-lg" >Interv.AI</h2>
                    
                 </div>
                 <h1 className="text-2xl md:text-3xl font-semibold text-center leading-snug mb-4">
                    Continue with 
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full inline-flex items-center gap-2">
                       <GiFlintSpark />
                       AI Smart Interview
                    </span>
                 </h1>
                 <p className="text-gray-500 text-center  text-sm md:text=base leading-relaxed mb-6">
                    Sign in to start your  AI-powered mock interview , 
                    track your progress and  unlock your full potential and get detailed  perfomance insights.
                 </p>
                <motion.button
                onClick={handleGoogleAuth}
                // animation properties
                whileHover={{opacity:0.9 , scale:1.04}}
                whileTap={{opopacity:1 , scale:0.94}}

                 className="w-full flex items-center justify-center gap-3 py-3
                bg-black text-white rounded-full shadow-md" >
                    <FcGoogle size={20} />
                    Continue with Google
                </motion.button>
                
            </motion.div>
            
        </div>
    )
}
export default Auth;
