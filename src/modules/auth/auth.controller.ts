  import type { Request, Response } from "express";
  import { authService } from "./auth.service.js";

  const loginUser = async (req: Request, res: Response) => {
    try {
      const result = await authService.loginUserIntoDB(req.body);

      const {refreshToken} = result;

      res.cookie("refreshToken", refreshToken ,{
        secure: false, //in producttion >> true
        httpOnly: true, 
      })

      res.status(200).json({
        success: true,
        message: "User login successfully!",
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        error: error,
      });
    }
  };

  const refreshToken = async (req: Request, res: Response)=>{
    try {
      const result = await authService.geberateRefreshToken(req.cookies.refreshToken);

      res.status(200).json({
        success: true,
        message: "access token genearte successfully!",
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        error: error,
      });
    }
  
  } 

  export const authController = {
    loginUser,
    refreshToken,
  };