import { Request, Response } from "express"
import { URIParamsBlogIdModel } from "../models/URIParamsBlogIdModel"
import { PostsQueryModel } from "../../posts/models/PostsQueryModel"
import { PostsViewModel } from "../../posts/models/PostsViewModel"
import { SETTINGS } from "../../../settings"
import { queryDefaulPostsValues } from "../../../helper/queryDefaultValues"
import { blogsQueryRepository } from "../repository/blogs-query-repository"
import { postsQueryRepository } from "../../posts/repository/posts-query-repository"
import { RequestWithParamsAndQuery } from "../../../common/types/requestTypes"


export const findAllPostsOfBlogController = async (
    req: RequestWithParamsAndQuery<URIParamsBlogIdModel, PostsQueryModel>, res: Response<PostsViewModel | { error: string }>) => {

    const foundBlog = await blogsQueryRepository.findBlog(req.params.id)
    if (!foundBlog) {
        res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    const sanitizedQuery = queryDefaulPostsValues(req.query)
    const blogId = req.params.id
    const allPosts = await postsQueryRepository.findAllPosts(sanitizedQuery, blogId)
    res
        .status(SETTINGS.HTTP_STATUSES.OK_200)
        .json(allPosts)
}