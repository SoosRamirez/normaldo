import {User} from "../models/User"
import {Role} from "../models/Role"
import * as bcrypt from 'bcryptjs'
import * as jwt from "jsonwebtoken"
import {validationResult} from "express-validator"
import {secret} from "../config"
import {Types} from "mongoose";
import {Request, Response} from "express"
import {Token} from "../models/Token";
import creatEmail from "../user/userHelpers";


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
            const {nickname, email, password} = req.body
            const candidate = await User.findOne({email})
            if (candidate) {
                return res.status(400).json({message: 'User with this nickname already exists'})
            }
            const hashPassword = bcrypt.hashSync(password, 10)
            const userRole = await Role.findOne({value: "USER"})
            const user = new User({nickname: nickname, email: email, password: hashPassword, roles: [userRole.value]})
            await user.save()
            const token = generateAccessToken(user._id, user.roles)
            await creatEmail(req, res, user._id.toString())
            const sendUser = await User.findById(user._id, {'nickname': 1,
                'email': 1,
                'confirmed': 1,
                'roles': 1,
                'dollars': 1,
                'highScore': 1,
                'extraLives': 1,
                'level': 1,
                'experience': 1,
                'totalPizzas': 1,
                'skins': 1})
            return res.json({token: token, user: sendUser})
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: 'Signup error'})
        }
    }

    async login(req: Request, res: Response): Promise<Response> {
        try {
            const {email, password} = req.body
            const user = await User.findOne({email})
            if (!user) {
                return res.status(404).json({message: `Login error. User ${email} not found `})
            }
            const validPass = bcrypt.compareSync(password, user.password)
            if (!validPass) {
                return res.status(400).json({message: `Login error. Wrong password`})
            }
            const token = generateAccessToken(user._id, user.roles)
            const sendUser = await User.findById(user._id, {'nickname': 1,
                'email': 1,
                'confirmed': 1,
                'roles': 1,
                'dollars': 1,
                'highScore': 1,
                'extraLives': 1,
                'level': 1,
                'experience': 1,
                'totalPizzas': 1,
                'skins': 1})
            return res.json({token: token, user: sendUser})
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
