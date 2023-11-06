import { User } from "../models/User"
import { Role } from "../models/Role"
import * as bcrypt from 'bcryptjs'
import * as jwt from "jsonwebtoken"
import { validationResult } from "express-validator"
import { secret } from "../config"
import {Types} from "mongoose";
import { Request, Response} from "express"


const generateAccessToken = (id: Types.ObjectId, roles: string[]) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"})
}

export class AuthController {
    async signup(req: Request, res: Response): Promise<Response> {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: 'Signup error', errors})
            }
            const {username, email, password} = req.body
            const candidate = await User.findOne({username})
            if (candidate) {
                return res.status(400).json({message: 'User with this username already exists'})
            }
            const hashPassword = bcrypt.hashSync(password, 10)
            const userRole = await Role.findOne({value: "ADMIN"})
            const user = new User({username, email: email, password: hashPassword, roles: [userRole.value]})
            await user.save()
            return res.json({message: 'User created successfully'})
        } catch (e) {
            console.log(e)
            return res.status(400).json({message: 'Signup error'})
        }
    }

    async login(req: Request, res: Response): Promise<Response> {
        try {
            const {username, password} = req.body
            const user = await User.findOne({username})
            if (!user) {
                return res.status(404).json({message: `Login error. User ${username} not found `})
            }
            const validPass = bcrypt.compareSync(password, user.password)
            if (!validPass) {
                return res.status(400).json({message: `Login error. Wrong password`})
            }
            const token = generateAccessToken(user._id, user.roles)
            return res.json({token})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Login error'})
        }
    }

    async getUsers(req: Request, res: Response): Promise<Response> {
        try {
            const users = await User.find()
            return res.json(users)
        } catch (e) {
            console.log(e)
        }
    }
}
