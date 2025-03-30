import { NextFunction, Request, Response } from "express";
import ErrorHanlder from "../utils/utilityClass.js";
import { ControllerType } from "../types/types.js";

export const errorMiddleware = (error: ErrorHanlder, req: Request, res: Response, next: NextFunction) => {
    error.message ||= "Internal Server Error";
    error.statusCode ||= 500;
    if(error.name === "CastError") error.message = "Invalid ID";
    res.status(400).json({ success: false, message: error.message });
};

export const TryCatch = (fn:ControllerType) => {
    return (req:Request,res:Response,next:NextFunction) => {
        Promise.resolve(fn(req,res,next)).catch(next);
    }
};