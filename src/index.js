const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const userRouter = require('./routes/userRouter')

const app = express()
dotenv.config()

connectDB() 

app.use(express.json())

app.use('/user',userRouter)

const PORT = process.env.PORT || 5000

app.listen(PORT,() => console.log(`Server is connected on PORT ${PORT}`))