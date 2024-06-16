import { Router } from "express";
import {
    inputConfirmCodeAuthValidator,
    inputEmailAuthValidator, inputLoginAuthValidator, inputLoginOrEmailAuthValidator,
    inputPasswordAuthValidator
} from "../features/auth/validators/auth-login-validator-middleware";
import { authController } from "../features/auth/controllers/authController";
import { inputCheckErrorsMiddleware } from "../common/middlewares/input-check-errors-middleware";
import { authBearerMiddleware } from "../common/middlewares/auth-bearer-middleware";

export const authRouter = Router()

authRouter.post('/login',
    inputLoginOrEmailAuthValidator(),
    inputPasswordAuthValidator(),
    inputCheckErrorsMiddleware,
    authController.authLogin)

authRouter.post('/registration',
    inputLoginAuthValidator(),
    inputEmailAuthValidator(),
    inputPasswordAuthValidator(),
    inputCheckErrorsMiddleware,
    authController.authRegistration)

authRouter.post('/registration-confirmation',
    inputConfirmCodeAuthValidator(),
    inputCheckErrorsMiddleware,
    authController.authRegistrationConfirmation)

authRouter.post('/registration-email-resending',
    inputEmailAuthValidator(),
    inputCheckErrorsMiddleware,
    authController.authRegistrationEmailResending)


authRouter.get('/me',
    authBearerMiddleware,
    authController.authMe)