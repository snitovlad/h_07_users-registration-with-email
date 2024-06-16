import { Request, Response } from 'express'
import { URIParamsBlogIdModel } from '../models/URIParamsBlogIdModel'
import { BlogViewModel } from '../models/BlogViewModel'
import { SETTINGS } from '../../../settings'
import { blogsQueryRepository } from '../repository/blogs-query-repository'
import { RequestWithParams } from '../../../common/types/requestTypes'

export const findBlogController = async (req: RequestWithParams<URIParamsBlogIdModel>,
    res: Response<BlogViewModel>) => {
    const foundBlog = await blogsQueryRepository.findBlog(req.params.id)
    if (!foundBlog) {
        res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    res.json(foundBlog)
}
