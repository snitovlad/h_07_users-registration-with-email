import { Request, Response } from 'express'
import { URIParamsBlogIdModel } from '../models/URIParamsBlogIdModel'
import { UpdateBlogModel } from '../models/UpdateBlogModel'
import { SETTINGS } from '../../../settings'
import { blogsService } from '../services/blogs-service'
import { RequestWithParamsAndBody } from '../../../common/types/requestTypes'

export const updateBlogController = async (
    req: RequestWithParamsAndBody<URIParamsBlogIdModel, UpdateBlogModel>,
    res: Response) => {

    const isUpdate = await blogsService.updateBlog(req.params.id, req.body)
    if (!isUpdate) {
        res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND_404)
        return
    } else {
        res.sendStatus(SETTINGS.HTTP_STATUSES.N0_CONTENT_204)
    }
}
