import express, {Express} from "express"
import authRouter from "./auth/authRouter"
import skinRouter from "./skins/skinsRouter"
import authMiddleware from "./middlewares/authMiddleware"
import {connect} from "mongoose";
import userRouter from "./user/userRouter";
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT

const app: Express = express()

app.use(express.json())
app.use("/auth", authRouter)
app.use("/skins", authMiddleware, skinRouter)
app.use("/user", authMiddleware, userRouter)


app.listen(PORT, async () => {
    await connect(`mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/?authSource=admin`);
    console.log(`Running on ${PORT} port`)
})