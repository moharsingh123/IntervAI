import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import InterviewPage from'./pages/InterviewPage';
import { useEffect } from "react";
import axios from "axios";
import { setUserData } from "./redux/userSlice";
import {  useDispatch } from 'react-redux'
import InterviewHistory from "./pages/InterviewHistory";
import Pricing from "./pages/Pricing";
import InterviewReport from "./pages/InterviewReport";

export const ServerUrl= "https://intervai-1-6oqp.onrender.com"

const App =()=>{
  // find the current user from the backend server and set it in the state
  const dispatch = useDispatch()
  useEffect(()=>{
    
    const getUser = async()=>{
      try {
        const token = localStorage.getItem("token");
        const config = {
          withCredentials:true,
          headers: {}
        };
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        const result = await axios.get(ServerUrl + '/api/user/current-user', config)
       dispatch(setUserData(result.data.user))
      } catch (error) {
        console.log(error);
        dispatch(setUserData(null))
      }
    }
    

    getUser()
  } ,[dispatch])
  return(
   <Routes>
      {/* <Route path="/" element={<Home />} /> */}
      { <Route path='/' element = {<Home/>} />}
      { <Route path='/auth' element = {<Auth/>} />}
      { <Route path='/interview' element = {<InterviewPage/>} />}
      { <Route path='/history' element = {<InterviewHistory/>} />}
      { <Route path='/pricing' element = {<Pricing/>} />}
      { <Route path='/report/:id' element = {<InterviewReport/>} />}
   </Routes>


  )
}
export default App;
