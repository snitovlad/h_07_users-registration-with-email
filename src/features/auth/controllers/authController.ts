import { Request, Response } from "express";
import { LoginAuthModel } from "../models/LoginAuthModel";
import { authService } from "../services/auth-service";
import { ResultStatus } from "../../../common/types/resultCode";
import { jwtService } from "../../../common/adapters/jwt.service";
import { SETTINGS } from "../../../settings";
import { CurrentUserViewModel } from "../models/CurrentUserViewModel";
import { usersQueryRepository } from "../../users/repository/users-query-repository";
import { RequestWithBody } from "../../../common/types/requestTypes";
import { RegistrationAuthwModel } from "../models/RegistrationAuthModel";
import { ConfirmationCodeModel } from "../models/ConfirmationCodeModel";
import { RegistrationEmailResendingModel } from "../models/RegistrationEmailResendingModel";

export const authController = {

    async authLogin(req: RequestWithBody<LoginAuthModel>, res: Response) {
        const result = await authService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (result.status === ResultStatus.Success) {
            if (result.data) {
                const accessToken = await jwtService.createJWTToken(result.data)
                res
                    .status(SETTINGS.HTTP_STATUSES.OK_200)
                    //.send(accessToken)
                    .json({ accessToken }) //передаст в формате json {accessToken: 'token'}
            }
        } else {
            res.sendStatus(SETTINGS.HTTP_STATUSES.UNAUTHORIZED_401)
        }
    },

    async authRegistrationConfirmation(req: RequestWithBody<ConfirmationCodeModel>, res: Response) {
        const isEmailConfirmed = await authService.confirmEmail(req.body.code)
        if (isEmailConfirmed) {
            res
                .sendStatus(SETTINGS.HTTP_STATUSES.N0_CONTENT_204)

        } else {
            res
                .status(SETTINGS.HTTP_STATUSES.BAD_REQUEST_400)
                .send({
                    errorsMessages: [
                        {
                            message: "the confirmation code is incorrect, expired or already been applied",
                            field: "auth"
                        }
                    ]
                })
        }
    },

    async authRegistration(req: RequestWithBody<RegistrationAuthwModel>, res: Response) {
        //здесь registrationInfo = {status, errorMessage?, data?}
        const registrationInfo = await authService.registerUser(req.body.login, req.body.password, req.body.email)
        if (registrationInfo.status !== ResultStatus.Success) {
            res
                .status(SETTINGS.HTTP_STATUSES.BAD_REQUEST_400)
                .json(registrationInfo.errorMessage)
            return
        }
        res.sendStatus(SETTINGS.HTTP_STATUSES.N0_CONTENT_204)
    },

    async authRegistrationEmailResending(req: RequestWithBody<RegistrationEmailResendingModel>, res: Response) {
        //здесь registrationInfo = {status, errorMessage?, data?}
        const registrationEmailResendingInfo = await authService.resendConfirmationCode(req.body.email)
        if (registrationEmailResendingInfo) {
            res
                .sendStatus(SETTINGS.HTTP_STATUSES.N0_CONTENT_204)

        } else {
            res
                .status(SETTINGS.HTTP_STATUSES.BAD_REQUEST_400)
                .send({
                    errorsMessages: [
                        {
                            message: "the inputModel has incorrect values or email is already confirmed",
                            field: "auth"
                        }
                    ]
                })
        }
    },

    async authMe(req: Request, res: Response<CurrentUserViewModel>) {
        const me = await usersQueryRepository.findUser(req.userId!)
        if (!me) {
            res.sendStatus(SETTINGS.HTTP_STATUSES.UNAUTHORIZED_401)
            return
        }
        res
            .status(SETTINGS.HTTP_STATUSES.OK_200)
            .send({
                email: me.email,
                login: me.login,
                userId: me.id
            })
    }
}
