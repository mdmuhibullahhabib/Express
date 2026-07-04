import type { NextFunction, Request, Response } from "express";


const auth = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // console.log("this is protected");

        console.log(req.headers.authorization);

        const token = req.headers.authorization;

        if (!token) {
            res.status(401).json({
                success :false,
                message: "unauthorized access",
            })
        }         

        next();
    }
}

export default auth;