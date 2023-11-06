import * as jwt from "jsonwebtoken"
import { secret } from "../config"
import {NextFunction, Request, Response} from "express"


export function roleMiddleware(roles: string[]){
    return function (req: Request, res: Response, next: NextFunction) {
        if (req.method === "OPTIONS") {
            next()
        }
        try {
            const token: string = req.headers.authorization.split(" ")[1]
            if (!token) {
                return res.status(403).json({message: "User is not authenticate"})
            }
            const roles  = jwt.verify(token, secret)['roles']
            let hasRole = false
            for (const role of roles)  {
                if (roles.includes(role)) {
                    hasRole = true
                }
            }
            if (!hasRole) {
                return res.status(403).json({message: "Access denied"})
            }
            next()
        } catch (e) {
            console.log(e)
            return res.status(401).json({message: "User is not authenticate"})
        }
    }
}