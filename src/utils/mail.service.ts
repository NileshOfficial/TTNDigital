import { createTransport, Transporter } from 'nodemailer';
import * as dotenv from 'dotenv';
import { MailOptions } from 'nodemailer/lib/ses-transport';

dotenv.config();

const mailConfig = {
	host: process.env.SMTP_HOST,
	port: Number(process.env.SMTP_PORT),
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_KEY
	}
};

const _transporter: Transporter = createTransport(mailConfig);

export const notify = async (to: string, subject: string, text: string, html: string) => {
    const _mailOptions: MailOptions = {
        from: 'nilesh.kumar@tothenew.com',
        to: to,
        subject: subject,
        text: text,
        html: html
    };

    return await _transporter.sendMail(_mailOptions);
}