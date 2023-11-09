import {Response} from "express";
import {randomBytes} from "crypto";
import {User} from "../models/User";
import {Token} from "../models/Token";
import sendEmail from "./userHelpers";
import {IGetUserAuthInfoRequest} from "../interfaces/IgetUserAuthInfoRequest";
import {Skin} from "../models/Skin";

export class UserController {
    async getInfo(req: IGetUserAuthInfoRequest, res: Response): Promise<Response> {
        try {
            const userId = req.user
            const user = await User.findById(userId)
                .select({username: 1, dollars: 1, highScore: 1, extraLives: 1, level: 1})
                .lean();
            return res.status(200).json({user: user})
        } catch (e) {
            console.log(e)
            return res.status(400).json({message: 'Error getting info about user'})
        }
    }

    async sendVerifyEmail(req: IGetUserAuthInfoRequest, res: Response): Promise<Response> {
        try {
            const userId = req.user
            const user = await User.findById(userId).select({email: 1}).lean();
            let newToken = await new Token({
                userId: userId,
                token: randomBytes(32).toString("hex"),
            }).save();
            const message = `${process.env.BASE_URL}/auth/verify/${userId}/${newToken.token}`;
            await sendEmail(user.email, "Verify Email", message);
            return res.send("An Email sent to your account please verify");
        } catch (error) {
            return res.status(400).send("An error occured");
        }
    }
    async obtainSkin(req: IGetUserAuthInfoRequest, res: Response):Promise<Response>{
        try {
            const userId = req.user
            const skinUniqueId = req.body.skinUniqueId
            const skin = await Skin.findOne({uniqueId: skinUniqueId})
            if (!skin){
                return res.status(404).json({message: 'skin not found'})
            }
            const user = await User.findOneAndUpdate({ _id: userId }, {"$push": { "skins": skin.uniqueId }})
            await user.save()
            return res.json({message: `skin ${skinUniqueId} obtained by ${user.username}`})
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: 'error occurred'})
        }
    }
    async getObtained(req: IGetUserAuthInfoRequest, res: Response):Promise<Response>{
        try{
            const user = await User.findById(req.user)
            const skins = await Skin.find({ uniqueId: { $in: user.skins } })
            return res.json(skins)
        } catch (e) {
            console.log(e)
            return res.status(500).json({message:'server error'})
        }
    }
}