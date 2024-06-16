import { Router } from "express";
import { inputIdValidator } from "../common/validators/input-id-validator";
import { inputContentCommentValidator } from "../features/comments/validators/comment-validation-middleware";
import { commentsController } from "../features/comments/controllers/commentsController";
import { authBearerMiddleware } from "../common/middlewares/auth-bearer-middleware";
import { inputCheckErrorsMiddleware } from "../common/middlewares/input-check-errors-middleware";

export const commentsRouter = Router()

commentsRouter.put('/:id',
    authBearerMiddleware,
    inputIdValidator(),
    inputContentCommentValidator(),
    inputCheckErrorsMiddleware,
    commentsController.updateComment)

commentsRouter.delete('/:id',
    authBearerMiddleware,
    inputIdValidator(),
    inputCheckErrorsMiddleware,
    commentsController.deleteComment)

commentsRouter.get('/:id',
    inputIdValidator(),
    inputCheckErrorsMiddleware,
    commentsController.findCommentById)