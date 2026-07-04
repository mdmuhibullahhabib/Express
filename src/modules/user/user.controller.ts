import type { Request, Response } from "express";
import { userService } from "./user.service.js";



const createUser = async (req: Request, res: Response) => {

    // const { name, email, password, age } = req.body;

    try {
        const result = await userService.createUserIntoDB(req.body)

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
}


const getAllUSer = async (req: Request, res: Response) => {
    try {
        const result = await userService.getAllUserFromDB()

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
}

const getSIngleUSer = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {

        const result = await userService.getSingleUserFromDB(id as string)

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
}

const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, password, age, is_active } = req.body;

    // console.log(id,"id");
    // console.log({ name, password, age, is_active });

    try {

        const result = await userService.upUpdateUSerFromDB(req.body, id as string)

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
}

const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await userService.deleteUserFromDB(id as string)

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
}

export const userController = {
    createUser,
    getAllUSer,
    getSIngleUSer,
    updateUser,
    deleteUser,

}