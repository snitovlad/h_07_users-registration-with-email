import { BlogsQueryModel } from '../models/BlogsQueryModel';
import { Request, Response } from "express"
import { BlogsViewModel } from "../models/BlogsViewModel"
import { queryDefaulBlogsValues } from '../../../helper/queryDefaultValues';
import { SETTINGS } from '../../../settings';
import { blogsQueryRepository } from '../repository/blogs-query-repository';
import { RequestWithQuery } from '../../../common/types/requestTypes';


export const findAllBlogsController = async (
    req: RequestWithQuery<BlogsQueryModel>, res: Response<BlogsViewModel | { error: string }>) => {
    const sanitizedQuery = queryDefaulBlogsValues(req.query)

    const allBlogs = await blogsQueryRepository.findAllBlogs(sanitizedQuery)
    res
        .status(SETTINGS.HTTP_STATUSES.OK_200)
        .json(allBlogs)
}
// as {[key: string]: number | undefined}