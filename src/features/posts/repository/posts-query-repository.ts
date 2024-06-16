import { ObjectId } from "mongodb"
import { PostViewModel } from "../models/PostViewModel"
import { postCollection } from "../../../db/mongo-db"
import { PostsSanitizedQueryModel } from "../models/PostsSanitizedQueryModel"
import { PostsViewModel } from "../models/PostsViewModel"
import { PostDBType } from "../../../db/db-type"
import { commonResponseGeneration } from "../../../helper/responseGeneration"

export const postsQueryRepository = {

    // async findAllPosts(): Promise<PostViewModel[]> {
    //     const posts = await postCollection.find({}).toArray() //здесь можно без await
    //     return posts.map(this.mapToOutput)
    // },

    async findPost(id: string): Promise<PostViewModel | null> {
        const post = await postCollection.findOne({ _id: new ObjectId(id) })
        if (!post) return null
        return this.mapToOutput(post)
    },

    async findAllPosts(sanitizedQuery: PostsSanitizedQueryModel, blogId?: string): Promise<PostsViewModel | { error: string }> {
        // формирование фильтра (может быть вынесено во вспомогательный метод)
        const byId = blogId ? { blogId: blogId } : {}

        const filter = {
            ...byId,
            //_id: { $in: [new ObjectId(someStringId), ...] }, //когда хотим получить только те все объекты, id к-рых есть в массиве
            //...search,
        }

        try {
            // собственно запрос в бд (может быть вынесено во вспомогательный метод)
            const items = await postCollection
                .find(filter)
                .sort(sanitizedQuery.sortBy, sanitizedQuery.sortDirection)
                .skip((sanitizedQuery.pageNumber - 1) * sanitizedQuery.pageSize)
                .limit(sanitizedQuery.pageSize)
                .toArray() as PostDBType[]

            // подсчёт элементов (может быть вынесено во вспомогательный метод)
            const totalCount = await postCollection.countDocuments(filter)

            // формирование ответа в нужном формате
            return {
                ...commonResponseGeneration(filter, sanitizedQuery, totalCount),
                items: items.map(this.mapToOutput)
            }
        } catch (e) {
            console.log(e)
            return { error: 'error with getting of blogs' }
        }
    },

    mapToOutput(post: PostDBType): PostViewModel {
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId.toString(),
            blogName: post.blogName,
            createdAt: post.createdAt
        }
    }
}