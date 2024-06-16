import { Router } from "express";
import { usersController } from "../features/users/controllers/usersController";
import { inputPageNumberQueryValidator, inputPageSizeQueryValidator, inputSearchEmailTermQueryValidator, inputSearchLoginTermQueryValidator, inputSortByQueryValidator, inputSortDirectionQueryValidator } from "../common/validators/inputQueryValidation";
import { inputEmailUserBlogValidator, inputLoginUserValidator, inputPasswordUserValidator } from "../features/users/validators/user-validation-middleware";
import { inputIdValidator } from "../common/validators/input-id-validator";
import { inputCheckErrorsMiddleware } from "../common/middlewares/input-check-errors-middleware";
import { authMiddleware } from "../common/middlewares/auth-basic-middleware";

export const usersRouter = Router()

usersRouter.get('/',
    authMiddleware,
    inputSortByQueryValidator(),
    inputSortDirectionQueryValidator(),
    inputPageNumberQueryValidator(),
    inputPageSizeQueryValidator(),
    inputSearchLoginTermQueryValidator(),
    inputSearchEmailTermQueryValidator(),
    inputCheckErrorsMiddleware,
    usersController.findAllUsers
)

usersRouter.post('/',
    authMiddleware,
    inputLoginUserValidator(),
    inputPasswordUserValidator(),
    inputEmailUserBlogValidator(),
    inputCheckErrorsMiddleware,
    usersController.createUser
)

usersRouter.delete('/:id',
    authMiddleware,
    inputIdValidator(),
    inputCheckErrorsMiddleware,
    usersController.deleteUser
)