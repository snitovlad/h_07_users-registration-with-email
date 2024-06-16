import nodemailer from 'nodemailer'
import { SETTINGS } from '../../settings'

export const nodemailerService = {

    async sendEmail(email: string, code: string, template: (code: string) => string): Promise<boolean> {
        let transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: SETTINGS.EMAIL,
                pass: SETTINGS.EMAIL_PASS
            }
        })
        console.log("credentialCode: ", code)

        let info = await transport.sendMail({
            from: 'Vovan <SETTINGS.EMAIL>',
            to: email,
            subject: 'Your code is here',
            html: template(code)
        })
        return !!info
    }
}