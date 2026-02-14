import 'dotenv/config'
import express from 'express'
import {authenetication} from './middleware/auth.middleware.js'
const app=express()
const PORT=process.env.PORT ?? 8000
import userRouter from './routes/user.routes.js'
import urlRouter from './routes/url.routes.js'

app.use(express.json())
app.use(authenetication)


app.use('/user',userRouter)
app.use(urlRouter)

app.listen(PORT,()=>{
    console.log("Server is running");
})