import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken"
import config from "../config/index.js";
import { pool } from "../db/index.js";

const auth = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // console.log("this is protected");

        console.log(req.headers.authorization);

        const token = req.headers.authorization;

        if (!token) {
            res.status(401).json({
                success: false,
                message: "unauthorized access",
            })
        }
        const decoded = jwt.verify(token as string, config.secret as string) as JwtPayload;
        const userData = await pool.query(`
        SELECT * FROM users WHERE email= $1`,

            [decoded.email],
        )

        const user = userData.rows[0];
        console.log(user,"user");
        
        if (userData.rows.length === 0) {
            res.status(404).json({
                success:false,
                message: "user not found"
            })
            
        }

        if (user.is_active) {
            res.status(403).json({
                success:false,
                message: "Forbidde"
            })
            
        }

        next();
    }
}

export default auth;