import {User} from "../models/User"
import {Role} from "../models/Role"
import * as bcrypt from 'bcryptjs'
import * as jwt from "jsonwebtoken"
import {validationResult} from "express-validator"
import {secret} from "../config"
import {Types} from "mongoose";
import {Request, Response} from "express"
import {Token} from "../models/Token";


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
            const userRole = await Role.findOne({value: "USER"})
            const user = new User({username, email: email, password: hashPassword, roles: [userRole.value]})
            await user.save()
            return res.json({message: 'User created successfully'})
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: 'Signup error'})
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
            return res.status(500).json({message: 'Login error'})
        }
    }

    async verifyEmail(req: Request, res: Response): Promise<Response> {
        try {
            const user = await User.findById(req.params.id);
            if (!user) return res.status(400).send("Invalid link");

            const token = await Token.findOne({
                userId: user._id,
                token: req.params.token,
            });
            if (!token) return res.status(400).send("Invalid link");
            await User.updateOne({_id: user._id}, {confirmed: true});
            await Token.findByIdAndRemove(token._id);
            return res.send("email verified sucessfully");
        } catch (error) {
            return res.status(500).send("An error occured");
        }
    }
}
