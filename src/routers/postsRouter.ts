import { Router } from 'express'
import {
    inputBlogIdPostValidator, inputContentPostValidator, inputShortDescriptionPostValidator,
    inputTitlePostValidator
} from '../features/posts/validators/post-validation-middleware';
import { inputIdValidator } from '../common/validators/input-id-validator';
import { inputPageNumberQueryValidator, inputPageSizeQueryValidator, inputSortByQueryValidator, inputSortDirectionQueryValidator } from '../common/validators/inputQueryValidation';
import { postsController } from '../features/posts/controllers/postsController';
import { inputContentCommentValidator } from '../features/comments/validators/comment-validation-middleware';
import { inputCheckErrorsMiddleware } from '../common/middlewares/input-check-errors-middleware';
import { authMiddleware } from '../common/middlewares/auth-basic-middleware';
import { authBearerMiddleware } from '../common/middlewares/auth-bearer-middleware';


export const postsRouter = Router()

postsRouter.get('/',
    inputSortByQueryValidator(),
    inputSortDirectionQueryValidator(),
    inputPageNumberQueryValidator(),
    inputPageSizeQueryValidator(),
    inputCheckErrorsMiddleware,
    postsController.findAllPosts)

postsRouter.post('/',
    authMiddleware,
    inputTitlePostValidator(),
    inputShortDescriptionPostValidator(),
    inputContentPostValidator(),
    inputBlogIdPostValidator(),
    inputCheckErrorsMiddleware,
    postsController.createPost)

postsRouter.get('/:id',
    inputIdValidator(),
    inputCheckErrorsMiddleware,
    postsController.findPostById)

postsRouter.delete('/:id',
    authMiddleware,
    inputIdValidator(),
    inputCheckErrorsMiddleware,
    postsController.deletePost)

postsRouter.put('/:id',
    authMiddleware,
    inputIdValidator(),
    inputTitlePostValidator(),
    inputShortDescriptionPostValidator(),
    inputContentPostValidator(),
    inputBlogIdPostValidator(),
    inputCheckErrorsMiddleware,
    postsController.updatePost)

postsRouter.post('/:id/comments',
    authBearerMiddleware,
    inputIdValidator(),
    inputContentCommentValidator(),
    inputCheckErrorsMiddleware,
    postsController.createCommentForPost)

postsRouter.get('/:id/comments',
    inputIdValidator(),
    inputCheckErrorsMiddleware,
    postsController.findAllCommentsForPost)


