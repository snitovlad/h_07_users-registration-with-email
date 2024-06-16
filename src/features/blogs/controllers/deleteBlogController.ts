import { Request, Response } from 'express'
import { URIParamsBlogIdModel } from '../models/URIParamsBlogIdModel'
import { SETTINGS } from '../../../settings'
import { blogsService } from '../services/blogs-service'
import { RequestWithParams } from '../../../common/types/requestTypes'


export const deleteBlogController = async (req: RequestWithParams<URIParamsBlogIdModel>,
    res: Response) => {

    const isDelete = await blogsService.deleteBlog(req.params.id)
    if (isDelete) {
        res.sendStatus(SETTINGS.HTTP_STATUSES.N0_CONTENT_204)
    }
    else {
        res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND_404)
    }
}
