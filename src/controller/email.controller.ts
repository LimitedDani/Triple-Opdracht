import * as  nodemailer from 'nodemailer';
import { Coupon } from '../objects/coupon';

export class EmailController {
    static async sendWinnerDeliveryEmail(coupon: Coupon){
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: process.env.ETHEREAL_EMAIL, // generated ethereal user
              pass: process.env.ETHEREAL_PASSWORD, // generated ethereal password
            },
          });
            // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Daníque de Jong 👻" <winners@tigopdracht.com>', // sender address
            to: "winnersdelivery@tigopdracht.com", // list of receivers
            subject: "A new winner!", // Subject line
            html: JSON.stringify(coupon), // html body
        });

        console.log("Message sent: %s", info.messageId);
              console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
}