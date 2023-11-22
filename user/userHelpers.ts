import nodemailer from "nodemailer";
import {User} from "../models/User";
import {Token} from "../models/Token";
import {randomBytes} from "crypto";
import {Response, Request} from "express";
export default async function creatEmail(req: Request, res: Response, userId: string){
    const user = await User.findById(userId).select({email: 1}).lean();
    let newToken = await new Token({
        userId: userId,
        token: randomBytes(32).toString("hex"),
    }).save();
    const message = `${process.env.BASE_URL}/auth/verify/${userId}/${newToken.token}`;
    await sendEmail(user.email, "Verify Email", message);
}
async function sendEmail (email: string, subject: string, text: string)  {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        await transporter.sendMail({
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: subject,
            text: text,
        });
        console.log("email sent sucessfully");
    } catch (error) {
        console.log("email not sent");
        console.log(error);
    }
}
