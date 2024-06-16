import { Response } from "express"
import { URIParamsBlogIdModel } from "../models/URIParamsBlogIdModel"
import { CreatePostForBlogModel } from "../../posts/models/CreatePostForBlogModel"
import { PostViewModel } from "../../posts/models/PostViewModel"
import { ErrorsViewModel } from "../../../common/types/ErrorsViewModel"
import { SETTINGS } from "../../../settings"
import { postsService } from "../../posts/services/posts-service"
import { blogsQueryRepository } from "../repository/blogs-query-repository"
import { postsQueryRepository } from "../../posts/repository/posts-query-repository"
import { RequestWithParamsAndBody } from "../../../common/types/requestTypes"

export const createPostForBlogController = async (
    req: RequestWithParamsAndBody<URIParamsBlogIdModel, CreatePostForBlogModel>,
    res: Response<PostViewModel | null | ErrorsViewModel | { error?: string }>) => {

    const foundBlog = await blogsQueryRepository.findBlog(req.params.id)
    if (!foundBlog) {
        res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    const createdInfo = await postsService.createPostforBlog(foundBlog.id, foundBlog.name, req.body) //здесь createdInfo = {id: ObjectId()}

    if (!createdInfo.id) {
        res
            .status(SETTINGS.HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
            .json({})
        return
    }
    const newPost = await postsQueryRepository.findPost(createdInfo.id.toString())
    res
        .status(SETTINGS.HTTP_STATUSES.CREATED_201)
        .json(newPost)
}