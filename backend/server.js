const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const app=express()
const Auth=require("./routes/auth")
const HabitRoutes = require('./routes/habitRoute');
require('dotenv').config()
app.use(cors())
app.use(express.json())
app.use("/api/auth", Auth);
app.use('/api/habits', HabitRoutes);
const connectDB=async()=>{
   try{
    await mongoose.connect(
        process.env.MONGODB_URI
    )
    console.log("MongoDB connected Successfully")
   }catch(error){
        console.error("MongoDB connection error",error.message)
        process.exit(1)
   };
}
connectDB()
const port=process.env.PORT

app.get("/", (req, res) => {
  res.send("Server is running on port",port);
});
module.exports = app;