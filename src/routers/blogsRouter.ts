import { Router } from 'express'
import { inputDescriptionBlogValidator, inputNameBlogValidator, inputWebsiteUrlBlogValidator } from '../features/blogs/validators/blog-validation-middleware';
import { inputIdValidator } from '../common/validators/input-id-validator';
import { findAllBlogsController } from '../features/blogs/controllers/findAllBlogsController';
import {
    inputPageNumberQueryValidator, inputPageSizeQueryValidator, inputSearchNameTermQueryValidator, inputSortByQueryValidator,
    inputSortDirectionQueryValidator
} from '../common/validators/inputQueryValidation';
import { inputContentPostValidator, inputShortDescriptionPostValidator, inputTitlePostValidator } from '../features/posts/validators/post-validation-middleware';
import { findAllPostsOfBlogController } from '../features/blogs/controllers/findAllPostsOfBlogController';
import { createPostForBlogController } from '../features/blogs/controllers/createPostsForBlogController';
import { findBlogController } from '../features/blogs/controllers/findBlogController';
import { createBlogController } from '../features/blogs/controllers/createBlogController';
import { deleteBlogController } from '../features/blogs/controllers/deleteBlogController';
import { updateBlogController } from '../features/blogs/controllers/updateBlogController';
import { inputCheckErrorsMiddleware } from '../common/middlewares/input-check-errors-middleware';
import { authMiddleware } from '../common/middlewares/auth-basic-middleware';


export const blogsRouter = Router()

blogsRouter.get('/',
    inputSearchNameTermQueryValidator(),
    inputSortByQueryValidator(),
    inputSortDirectionQueryValidator(),
    inputPageNumberQueryValidator(),
    inputPageSizeQueryValidator(),
    inputCheckErrorsMiddleware,
    findAllBlogsController)

blogsRouter.get('/:id',
    inputIdValidator(),
    inputCheckErrorsMiddleware,
    findBlogController)

blogsRouter.get('/:id/posts',
    inputIdValidator(),
    inputSortByQueryValidator(),
    inputSortDirectionQueryValidator(),
    inputPageNumberQueryValidator(),
    inputPageSizeQueryValidator(),
    inputCheckErrorsMiddleware,
    findAllPostsOfBlogController)


blogsRouter.post('/',
    authMiddleware,
    inputNameBlogValidator(),
    inputDescriptionBlogValidator(),
    inputWebsiteUrlBlogValidator(),
    inputCheckErrorsMiddleware,
    createBlogController)

blogsRouter.post('/:id/posts',
    authMiddleware,
    inputIdValidator(),
    inputTitlePostValidator(),
    inputShortDescriptionPostValidator(),
    inputContentPostValidator(),
    inputCheckErrorsMiddleware,
    createPostForBlogController)



blogsRouter.delete('/:id',
    authMiddleware,
    inputIdValidator(),
    inputCheckErrorsMiddleware,
    deleteBlogController)

blogsRouter.put('/:id',
    authMiddleware,
    inputIdValidator(),
    inputNameBlogValidator(),
    inputDescriptionBlogValidator(),
    inputWebsiteUrlBlogValidator(),
    inputCheckErrorsMiddleware,
    updateBlogController)

// ...
