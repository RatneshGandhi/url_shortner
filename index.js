import express from 'express'
import {authenetication} from './middleware/auth.middleware.js'
const app=express()
const PORT=process.env.PORT ?? 8000
import userRouter from './routes/user.routes.js'

app.use(authenetication)
app.use(express.json())

app.use('/user',userRouter)

app.listen(PORT,()=>{
    console.log("Server is running");
})