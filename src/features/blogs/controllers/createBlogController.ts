import { Request, Response } from 'express'
import { CreateBlogModel } from '../models/CreateBlogModel'
import { BlogViewModel } from '../models/BlogViewModel'
import { ErrorsViewModel } from '../../../common/types/ErrorsViewModel'
import { SETTINGS } from '../../../settings'
import { blogsService } from '../services/blogs-service'
import { blogsQueryRepository } from '../repository/blogs-query-repository'
import { RequestWithBody } from '../../../common/types/requestTypes'

export const createBlogController = async (
    req: RequestWithBody<CreateBlogModel>,
    res: Response<BlogViewModel | null | ErrorsViewModel | { error?: string }>) => {

    const createdInfo = await blogsService.createdBlog(req.body) //здесь createdInfo = {id: ObjectId()}
    if (!createdInfo.id) {
        res
            .status(SETTINGS.HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
            .json({})
        return
    }
    const newBlog = await blogsQueryRepository.findBlog(createdInfo.id.toString())
    res
        .status(SETTINGS.HTTP_STATUSES.CREATED_201)
        .json(newBlog)
}
