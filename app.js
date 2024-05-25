import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth.routes.js'
import customerRouter from './routes/customer.routes.js'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/customer", customerRouter)


app.get('/', (req, res) => {
    res.json('Hello World')
})


const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.log(error);
    }
  }

const PORT = process.env.PORT || 4598

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("listening for requests on port", PORT);
    })
})
