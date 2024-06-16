import { ObjectId } from "mongodb"
import { CommentViewModel } from "../models/CommentViewModel"
import { commentCollection } from "../../../db/mongo-db"
import { CommentsQueryModel } from "../models/CommentsQueryModel"
import { CommentsViewModel } from "../models/CommentsViewModel"
import { queryDefaultCommentsValues } from "../../../helper/queryDefaultValues"
import { CommentDBType } from "../../../db/db-type"
import { commonResponseGeneration } from "../../../helper/responseGeneration"


export const commentsQueryRepository = {

    async findCommentById(id: string): Promise<CommentViewModel | null> {
        const comment = await commentCollection.findOne({ _id: new ObjectId(id) })
        if (!comment) return null
        return this.mapToOutput(comment)
    },

    //async findAllComments(sanitizedQuery: CommentsSanitizedQueryModel, postId: string)
    async findAllComments(query: CommentsQueryModel, postId: string)
        : Promise<CommentsViewModel | { error: string }> {

        const byId = postId ? { postId: postId } : {}
        const filter = {
            ...byId,
        }

        const sanitizedQuery = queryDefaultCommentsValues(query)

        try {
            // собственно запрос в бд (может быть вынесено во вспомогательный метод)
            const items = await commentCollection
                .find(filter)
                .sort(sanitizedQuery.sortBy, sanitizedQuery.sortDirection)
                .skip((sanitizedQuery.pageNumber - 1) * sanitizedQuery.pageSize)
                .limit(sanitizedQuery.pageSize)
                .toArray() as CommentDBType[]

            // подсчёт элементов (может быть вынесено во вспомогательный метод)
            const totalCount = await commentCollection.countDocuments(filter)

            // формирование ответа в нужном формате
            return {
                ...commonResponseGeneration(filter, sanitizedQuery, totalCount),
                items: items.map(this.mapToOutput)
            }
        } catch (e) {
            console.log(e)
            return { error: 'error with getting of comments' }
        }
    },

    mapToOutput(comment: CommentDBType): CommentViewModel {
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt,
        }
    },
}