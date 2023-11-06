import nodemailer from "nodemailer";
export default async function sendEmail (email: string, subject: string, text: string)  {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'iamsoos69@gmail.com',
                pass: 'syda qmzz bbpg utnr',
            },
        });
        console.log(email)
        await transporter.sendMail({
            from: 'iamsoos69@gmail.com',
            to: email,
            subject: subject,
            text: text,
        });
        console.log("email sent sucessfully");
    } catch (error) {
        console.log("email not sent");
        console.log(error);
    }
};
