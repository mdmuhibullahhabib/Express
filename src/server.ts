import express, { type Request, type Response } from "express";
import { Pool } from "pg";
import config from "./config/index.js";

const app = express()
const port = config.port;

app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({ extended: true }))

const pool = new Pool({
    connectionString: config.connection_string,
})

const initDB = async () => {
    try {
        await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(20),
            email VARCHAR(20) UNIQUE NOT NULL,
            password VARCHAR(20) NOT NULL,
            is_active BOOLEAN DEFAULT true,
            age INT,
            
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )
        `)
        console.log("database connect successfully")

    } catch (error) {
        console.log(error);
    }
}

initDB();

app.get('/api/', (req: Request, res: Response) => {
    //   res.send('Hello World!')
    res.status(200).json({
        "message": "express server",
        "author": "next"
    })
})

app.post('/api/users', async (req: Request, res: Response) => {

    const { name, email, password, age } = req.body;

    try {
        const result = await pool.query(`
        INSERT INTO users(name, email, password, age) VALUES($1,$2, $3, $4)
        RETURNING *
        `, [name, email, password, age]
        );

        // console.log(result);
        res.status(201).json({
            message: "create user",
            data: result.rows[0],
        })
    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            data: error,
        })
    }
})

app.get('/api/users', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
        SELECT * FROM users
        `)
        res.status(200).json({
            success: true,
            message: "get all users",
            data: result.rows,
        })

    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            data: error,
            success: false,
            error: error
        })
    }
})

app.get('/api/users/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
        SELECT * FROM users WHERE id=$1
        
        `, [id])

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "user not found",
                data: {},
            })
        }

        res.status(200).json({
            success: true,
            message: "get single users",
            data: result.rows[0],
        })

    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            data: error,
            success: false,
            error: error
        })
    }
})

app.put('/api/users/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, password, age, is_active } = req.body;

    // console.log(id,"id");
    // console.log({ name, password, age, is_active });

    try {
        const result = await pool.query(
            `
        UPDATE users 
        SET 
        name = COALESCE ($1, name), 
        password =COALESCE ($2, password), 
        age = COALESCE ($3, age), 
        is_active = COALESCE ($4, is_active)

        WHERE id = $5 RETURNING *
        `,
            [name, password, age, is_active, id])

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "user not found",
                data: {},
            })
        }

        // console.log(result);
        res.status(200).json({
            success: true,
            message: "update user",
            data: result.rows[0],
        })

    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            data: error,
            success: false,
            error: error
        })

    }
})

app.delete('/api/users/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
        DELETE FROM users WHERE id=$1
        `, [id],
        );

        console.log(result);

        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "user not found",
                data: {},
            })
        }

        res.status(200).json({
            success: true,
            message: "user deleted ",
            data: {},
        })

    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            data: error,
            success: false,
            error: error
        })
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})