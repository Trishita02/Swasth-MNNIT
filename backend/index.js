import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import { loginUser, logoutUser } from "./controllers/auth.controller.js";
import { isAuthenticated } from "./middlewares/auth.middleware.js";
import adminRouter from "./routes/admin.routes.js"
import staffRouter from "./routes/staff.routes.js"
import doctorRoute from "./routes/doctor.route.js"
import errorMiddleware from "./middlewares/error.middleware.js";
dotenv.config({
    path:'./.env'
})


const app=express();
app.use(cookieParser())
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json()) 
app.use(express.urlencoded({extended:false}))
app.use(express.static("public"))


// ROUTES
app.post("/login", loginUser);
app.post("/logout", isAuthenticated, logoutUser);
app.use('/admin', adminRouter)
app.use("/staff", staffRouter)
app.use("/doctor", doctorRoute)
// app.use(errorMiddleware);

//Connect database
const connectDB=async()=>{
    try{
        const connectionInstance=await mongoose.connect(process.env.MONGO_URL)
        console.log("MongoDB connected!")
    }catch(error){
        console.log("MONGODB connection error",error);
        process.exit(1);
    }
}



// starting server
const PORT=process.env.PORT 
connectDB()
.then(()=>{
    app.listen(PORT,()=>console.log(`Server has started on Port: ${PORT}`))
}).catch((error)=>console.log(`${error} did not connect`))