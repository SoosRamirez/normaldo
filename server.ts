import express, {Express} from "express"
import authRouter from "./auth/authRouter"
import skinRouter from "./skins/skinsRouter"
import authMiddleware from "./middlewares/authMiddleware"
import { connect } from "mongoose";
import userRouter from "./user/userRouter";
const PORT: number = 3000

const app: Express = express()

app.use(express.json())
app.use("/auth", authRouter)
app.use("/skins", authMiddleware, skinRouter)
app.use("/user", authMiddleware, userRouter)



app.listen(PORT, async () => {
    await connect(`mongodb://soos:something@mongo:27017/?authSource=admin`);
    console.log(`Running on ${PORT} port`)
})