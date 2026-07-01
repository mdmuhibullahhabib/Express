import express, { type Request, type Response } from "express";
import { Pool } from "pg";

const app = express()
const port = 5000

app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({ extended: true }))

const pool = new Pool({
    connectionString: "postgresql://neondb_owner:npg_gw2slI1kGeZD@ep-icy-sound-ah1r6omt-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
})

const initDB = async () => {
    try {

        await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(20),
            email VARCHAR(20) NOT NULL,
            password VARCHAR(20) NOT NULL,
            is_active BOOLEAN DEFAULT true,
            age INT,
            
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )
        `)

        console.log("database connect successfully");
        

    } catch (error) {
        console.log(error);


    }
}

initDB();

app.get('/', (req: Request, res: Response) => {
    //   res.send('Hello World!')
    res.status(200).json({
        "message": "express server",
        "author": "next"
    })
})

app.post('/', async (req: Request, res: Response) => {
    // console.log(req.body, "req");
    const { name, mail, pass } = req.body;
    res.status(201).json({
        message: "create user",
        data: {
            name,
            mail,
        }
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})