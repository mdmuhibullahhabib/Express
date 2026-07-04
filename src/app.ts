import express, { type Request, type Response } from "express";
import { Pool } from "pg";
import config from "./config/index.js";
import { initDB, pool } from "./db/index.js";
import { userRoute } from "./modules/user/user.route.js";

const app = express()

app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({ extended: true }))





app.get('/', (req: Request, res: Response) => {
    //   res.send('Hello World!')
    res.status(200).json({
        "message": "express server",
        "author": "next"
    })
})

app.use('/api/users', userRoute)


export default app