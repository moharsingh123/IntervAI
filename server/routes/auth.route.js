import express from "express";

const authRouter =  express.Router()
const {googleAuth , logOut} =  await import('../controllers/auth.controller.js')

authRouter.post('/google' , googleAuth)
authRouter.get('/logout'  ,logOut )


export default authRouter;