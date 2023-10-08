const express = require("express")
const authRouter = require("./auth/authRouter")
require('./db')

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())
app.use("/auth", authRouter)


app.listen(PORT, () => {
    console.log(`Running on ${PORT} port`)
})