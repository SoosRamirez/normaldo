import * as jwt from "jsonwebtoken"
import { secret } from "../config"
import {NextFunction, Response} from "express"
import { IGetUserAuthInfoRequest } from "../interfaces/IgetUserAuthInfoRequest"


export default function authMiddleware(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction){
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        const token = req.headers.authorization.split(" ")[1]
        if (!token) {
            return res.status(401).json({message: "User is not authenticate"})
        }
        req.user = jwt.verify(token, secret)
        next()
    } catch (e) {
        console.log(e)
        return res.status(401).json({message: "User is not authenticate"})
    }
}