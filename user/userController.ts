import {Request, Response} from "express";
import * as jwt from "jsonwebtoken";
import {randomBytes} from "crypto";
import {secret} from "../config";
import {User} from "../models/User";
import {Token} from "../models/Token";
import sendEmail from "./userHelpers";

export class UserController {
    async getInfo(req: Request, res: Response): Promise<Response> {
        try {
            const token = req.headers.authorization.split(" ")[1]
            if (!token) {
                return res.status(403).json({message: "User is not authenticate"})
            }
            const userId = jwt.verify(token, secret)["id"]
            const user = await User.findById(userId)
                .select({username: 1, dollars: 1, highScore: 1, extraLives: 1, level: 1})
                .lean();
            return res.status(200).json({user: user})
        } catch (e) {
            console.log(e)
            return res.status(400).json({message: 'Error getting info about user'})
        }
    }

    async sendVerifyEmail(req: Request, res: Response): Promise<Response> {
        try {
            const token = req.headers.authorization.split(" ")[1]
            if (!token) {
                return res.status(403).json({message: "User is not authenticate"})
            }
            const userId = jwt.verify(token, secret)["id"]
            const user = await User.findById(userId).select({email: 1}).lean();
            let newToken = await new Token({
                userId: userId,
                token: randomBytes(32).toString("hex"),
            }).save();
            const message = `http://localhost:3000/user/verify/${userId}/${newToken.token}`;
            await sendEmail(user.email, "Verify Email", message);
            return res.send("An Email sent to your account please verify");
        } catch (error) {
            return res.status(400).send("An error occured");
        }
    }

    async verify(req: Request, res: Response): Promise<Response> {
        try {
            const user = await User.findById(req.params.id);
            if (!user) return res.status(400).send("Invalid link");

            const token = await Token.findOne({
                userId: user._id,
                token: req.params.token,
            });
            if (!token) return res.status(400).send("Invalid link");

            await User.updateOne({_id: user._id, confirmed: true});
            await Token.findByIdAndRemove(token._id);

            return res.send("email verified sucessfully");
        } catch (error) {
            res.status(400).send("An error occured");
        }
    }
}