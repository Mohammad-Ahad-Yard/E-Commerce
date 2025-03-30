import { User } from "../models/user.js";
import ErrorHanlder from "../utils/utilityClass.js";
import { TryCatch } from "./error.js";

// Middleware to make sure only admin is allowed
export const adminOnly = TryCatch(async (req, res, next) => {
    const { id } = req.query;
    if(!id){
        return next(new ErrorHanlder("Please Login First!", 401));
    }
    const user = await User.findById(id);
    if(!user){
        return next(new ErrorHanlder("Fake Id", 401));
    }
    if(user?.role !== "admin"){
        return next(new ErrorHanlder("You are not admin", 401));
    }
    next();
});