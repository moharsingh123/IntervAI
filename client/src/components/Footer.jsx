import React from 'react';
import { GiRobotGolem } from "react-icons/gi";
const Footer= ()=>{
    return(
        <div className='bg-red flex justify-center px-4 pb-10 py-4 pt-10'>
            <div className='w-full bg-pink max-w-9xl  rounded-[24xl] shadow-sm border border-gray-200
             py-8 px-3 text-center'>
                <div className='flex justify-center items-center gap-3 mb-3'>
                    <div className='bg-green text-white p-2 rounded-lg'>
                         <GiRobotGolem size={16}/>
                    </div>
                    <h2 className='font-semibold'>IntervAI</h2>
                </div>
                <p className='text-red-500 text-sm max-w-xl mx-auto'>
                    AI-Powered  interview preparation platform designed to improve 
                    communication skills , technical depth and professional confidense
                </p>
            </div>

        </div>
    )
}
export default Footer;