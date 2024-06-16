import { ObjectId } from "mongodb"
import { currentDateISOString } from "../../../helper/helper"
import { CreatePostModel } from "../models/CreatePostModel"
import { PostDBType } from "../../../db/db-type"
import { CreatePostForBlogModel } from "../models/CreatePostForBlogModel"
import { UpdatePostModel } from "../models/UpdatePostModel"
import { postsMongoRepository } from "../repository/posts-mongo-repository"

export const postsService = {

    async createPost(input: CreatePostModel, blogName: string | undefined): Promise<{ error?: string, id?: ObjectId }> {

        const newPost: PostDBType = {
            _id: new ObjectId(),
            ...input,
            blogName: blogName,
            createdAt: currentDateISOString(),
        }
        const createdInfo = await postsMongoRepository.createPost(newPost)
        return createdInfo
    },

    async createPostforBlog(blogId: string, blogName: string, input: CreatePostForBlogModel): Promise<{ error?: string, id?: ObjectId }> {
        const newPostForBlog: PostDBType = {
            _id: new ObjectId(),
            blogId: blogId,
            ...input,
            blogName: blogName,
            createdAt: currentDateISOString(),
        }
        const createdInfo = await postsMongoRepository.createPost(newPostForBlog)
        return createdInfo
    },

    async deletePost(id: string): Promise<boolean> {
        const deleteInfo = await postsMongoRepository.deletePost(id)
        return deleteInfo
    },

    async updatePost(id: string, input: UpdatePostModel): Promise<boolean | { error?: string }> {
        const updateInfo = await postsMongoRepository.updatePost(id, input)
        return updateInfo
    },

}