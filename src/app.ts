import express, { type Request, type Response } from "express";
import { userRoute } from "./modules/user/user.route.js";
import { authRoute } from "./modules/auth/auth.route.js";
import loger from "./middleware/logger.js";
import cookieParser from "cookie-parser"


const app = express()

app.use(cookieParser())

app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({ extended: true }))

app.use(loger);


app.get('/', (req: Request, res: Response) => {
    //   res.send('Hello World!')
    res.status(200).json({
        "message": "express server",
        "author": "next"
    })
})

app.use('/api/users', userRoute);
app.use("/api/auth", authRoute);


export default app