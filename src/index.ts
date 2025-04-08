import express, { Request, Response, NextFunction} from "express"
import compression from "compression"
import morgan from "morgan"
import helmet from "helmet"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import errorMiddleware from "./middleware/error.middleware"
import authRoutes from "./routes/auth.routes"
import userRoutes from "./routes/user.routes"

//ESTABLISHING A DATABASE CONNECTION
dotenv.config();
mongoose.connect(
    process.env.MONGO_URL,
).then(() => {
    console.log("Database Connection Successful");
}).catch(err => {
    console.log(err)
})

const app = express()
app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(
        {"message": "Welcome to the Fitness Tracker API"}
    )
})
app.use(express.json())
app.use(compression())
app.use(morgan("dev"))
app.use(helmet())
app.use(cors())
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/users", userRoutes)
app.use(errorMiddleware)

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Backend Server is currently listening on port ${port}`)
})