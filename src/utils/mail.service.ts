import { createTransport, Transporter } from 'nodemailer';
import * as dotenv from 'dotenv';
import { MailOptions } from 'nodemailer/lib/ses-transport';
import { readFileSync } from 'fs';

dotenv.config();

interface EmailData {
	heading: string;
	content: string;
	salutation: string;
	from: string;
}

const mailConfig = {
	host: process.env.SMTP_HOST,
	port: Number(process.env.SMTP_PORT),
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_KEY
	}
};

const _transporter: Transporter = createTransport(mailConfig);

const _createEmailFromTemplate = (emailData: EmailData): string => {
	let template = readFileSync([process.cwd(), 'templates', 'email.html'].join('/'), { encoding: 'utf8' });

	template = template.replace('__HEADING__', emailData.heading);
	template = template.replace('__CONTENT__', emailData.content);
	template = template.replace('__SALUTATION__', emailData.salutation);
	template = template.replace('__FROM__', emailData.from);

	return template;
};

export const notify = async (to: string, subject: string, emailData: EmailData) => {
	const _mailOptions: MailOptions = {
		from: 'nilesh.kumar@tothenew.com',
		to: to,
		subject: subject,
		html: _createEmailFromTemplate(emailData)
	};

	return await _transporter.sendMail(_mailOptions);
};
