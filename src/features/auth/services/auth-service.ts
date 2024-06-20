import { bcryptService } from "../../../common/adapters/bcrypt.service"
import { ResultStatus } from "../../../common/types/resultCode"
import { Result } from "../../../common/types/result.type"
import { usersMongoRepository } from "../../users/repository/user-mongo-repository"
import { randomUUID } from "crypto"
import { add } from "date-fns/add"
import { UserAccountDBType } from "../../../db/db-type"
import { ObjectId } from "mongodb"
import { nodemailerService } from "../../../common/adapters/email-adapter"
import { emailTemplates } from "../../../common/email-templates/emailTemplates"
import e from "express"

export const authService = {

    async registerUser(login: string, password: string, email: string): Promise<Result<string>> {

        const userByLogin = await usersMongoRepository.findByLoginOrEmail(login)
        if (userByLogin) return { //возвращаем объект с информацией в контроллер
            status: ResultStatus.BadRequest,
            errorMessage: {
                errorMessages: [{
                    message: 'the login is not unique',
                    field: 'login'
                }]
            }
        }

        const userByEmail = await usersMongoRepository.findByLoginOrEmail(email)
        if (userByEmail) return { //возвращаем объект с информацией в контроллер
            status: ResultStatus.BadRequest,
            errorMessage: {
                errorMessages: [{
                    message: 'the email address is not unique',
                    field: 'email'
                }]
            }
        }
        const passwordHash = await bcryptService.generateHash(password)

        const newUser: UserAccountDBType = {
            _id: new ObjectId(),
            login: login,
            email: email,
            passwordHash,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                isConfirmed: false,
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), { hours: 1, minutes: 30 })
            }
        }
        const userId = await usersMongoRepository.createUser(newUser)

        //мы не ждем когда письмо дойдет до пользователя, поэтому нет await
        //не await, поэтому результата не дожидаемся. try-catch теряет смысл. 
        //Можно .catch, т.к. приходит promise

        nodemailerService.sendEmail(  //не await, поэтому результата не дожидаемся. try-catch теряет смысл. Можно .catch
            newUser.email,
            newUser.emailConfirmation.confirmationCode,
            emailTemplates.registrationEmail)
            .catch((e: unknown) => console.error('Send email error', e))

        //возвращаем объект с информацией в контроллер
        return {
            status: ResultStatus.Success,
            data: userId.id?.toString()
        }
    },

    async checkCredentials(loginOrEmail: string, password: string): Promise<Result<string>> {
        const user = await usersMongoRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) {
            return { //возвращаем объект с информацией в контроллер
                status: ResultStatus.NotFound,
                errorMessage: {
                    errorMessages: [{
                        message: 'the user is not found',
                        field: 'user'
                    }]
                }
            }
        }
        const isPassCorrect = await bcryptService.checkPassword(password, user.passwordHash)
        if (isPassCorrect) {
            return { //возвращаем объект с информацией в контроллер
                status: ResultStatus.Success,
                data: user._id.toString()
            }
        }
        return { //возвращаем объект с информацией в контроллер
            status: ResultStatus.NotFound,
            errorMessage: {
                errorMessages: [{
                    message: 'the user is not found',
                    field: 'user'
                }]
            }
        }
    },

    async confirmEmail(code: string): Promise<boolean> {
        const user = await usersMongoRepository.findByConfirmationCode(code)
        if (!user) return false
        if (user.emailConfirmation.isConfirmed) return false
        if (user.emailConfirmation.expirationDate < new Date()) return false
        const isUpdateEmailConfirmation = usersMongoRepository.updateEmailConfirmation(user._id.toString())
        return isUpdateEmailConfirmation
    },

    async resendConfirmationCode(email: string): Promise<boolean> {
        const user = await usersMongoRepository.findByLoginOrEmail(email)
        if (!user) return false
        if (user.emailConfirmation.isConfirmed) return false
        const newConfirmationCode = randomUUID()
        const newExpirationDate = add(new Date(), { hours: 1, minutes: 30 })
        const isUpdateConfirmationCode = await usersMongoRepository.updateConfirmationCode(user._id.toString(), newConfirmationCode)
        const isUpdateExpirationDate = await usersMongoRepository.updateExpirationDate(user._id.toString(), newExpirationDate)

        try {
            await nodemailerService.sendEmail(email, newConfirmationCode, emailTemplates.registrationEmail)
        } catch (e: unknown) {
            console.error('Send email error ', e)
        }
        return (isUpdateConfirmationCode && isUpdateExpirationDate)
    }
}