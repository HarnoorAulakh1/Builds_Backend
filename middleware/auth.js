import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

export const checkLoginStatus=async(req,res,next)=>{
    let token=req.cookies.accessToken || req.headers["authorization"]?.replace("Bearer ","");
    try{
        const valid=jwt.verify(token,process.env.Access_Token);
        if(!valid)
        res.send("0");
        req.user=valid;
        next();
    }
    catch(err){
        res.send("0");
    }
}
