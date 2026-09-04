import bcrypt from "bcryptjs";

import jwt, { type JwtPayload } from "jsonwebtoken";
import { pool } from "../../db/index.js";
import config from "../../config/index.js";

const loginUserIntoDB = async (payload: {
    email: string;
    password: string;
}) => {
    const { email, password } = payload;
    // 1. Check if the user exists -> Done
    // 2. Compare the password -> Done
    //3. Generate Token -> Done

    // 1. Check if the user exists
    const userData = await pool.query(
        `
    SELECT * FROM users WHERE email=$1
    `,
        [email],
    );
    if (userData.rows.length === 0) {
        throw new Error("Invalid Credentials!");
    }

    // 2. Compare the password -> Done
    const user = userData.rows[0];
    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
        throw new Error("Invalid Credentials!");
    }

    //3. Generate Token
    const jwtpayload = {
        id: user.id,
        name: user.name,
        role: user.role,
        is_active: user.is_active,
        email: user.email,
    };

    const accessToken = jwt.sign(jwtpayload, config.secret as string, {
        expiresIn: "1d",
    });

    const refreshToken = jwt.sign(jwtpayload, config.refresh_secret as string, {
        expiresIn: "1d",
    });

    return { accessToken, refreshToken };
};

const geberateRefreshToken = async (token: string) => {

    if (!token) {
        throw new Error("unautorished")

    }
    const decoded = jwt.verify(token as string, config.refresh_secret as string) as JwtPayload;
    const userData = await pool.query(`
    SELECT * FROM users WHERE email= $1`,

        [decoded.email],
    )

    const user = userData.rows[0];

    console.log(user, "user");

    if (userData.rows.length === 0) {
        throw new Error("user Not found")
    }



    if (!user?.is_active) {
        throw new Error("foebidden")

    }

            //3. Generate Token
    const jwtpayload = {
        id: user.id,
        name: user.name,
        role: user.role,
        is_active: user.is_active,
        email: user.email,
    };

    const accessToken = jwt.sign(jwtpayload, config.secret as string, {
        expiresIn: "1d",
    });
return accessToken;
};

export const authService = {
    loginUserIntoDB,
    geberateRefreshToken,
};