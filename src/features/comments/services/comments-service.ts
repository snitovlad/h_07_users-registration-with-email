import { ObjectId } from "mongodb";
import { CommentDBType } from "../../../db/db-type";
import { Result } from "../../../common/types/result.type";
import { ResultStatus } from "../../../common/types/resultCode";
import { UpdateCommentModel } from "../models/UpdareCommentModel";
import { usersMongoRepository } from "../../users/repository/user-mongo-repository";
import { commentsMongoRepository } from "../repository/comments-mongo-repository";

export const commentsService = {

    async createComment(content: string, postId: string, userId: string): Promise<Result<string>> {

        const user = await usersMongoRepository.findUserById(userId)

        if (!user) return {
            status: ResultStatus.NotFound,
            errorMessage: {
                errorMessages: [{
                    message: 'the login is not found',
                    field: 'login'
                }]
            }
        }
        const newComment: CommentDBType = {
            _id: new ObjectId(),
            postId: postId,
            content: content,
            commentatorInfo: {
                userId: userId,
                userLogin: user.login
            },
            createdAt: new Date().toISOString(),
        }
        const createdInfo = await commentsMongoRepository.createComment(newComment)

        if (createdInfo.error) return {
            status: ResultStatus.NotCreated,
            errorMessage: {
                errorMessages: [{
                    message: 'the comment is not created',
                    field: 'comment'
                }]
            }
        }

        return {
            status: ResultStatus.Success,
            data: createdInfo.id?.toString()
        }
    },

    async updateComment(commentId: string, input: UpdateCommentModel, userId: string): Promise<Result<boolean | { error?: string }>> {
        const foundComment = await commentsMongoRepository.findCommentById(commentId)

        if (!foundComment) return {
            status: ResultStatus.NotFound,
            errorMessage: {
                errorMessages: [{
                    message: 'the comment is not found',
                    field: 'comment'
                }]
            }
        }

        if (foundComment.commentatorInfo.userId !== userId) return {
            status: ResultStatus.Forbidden,
            errorMessage: {
                errorMessages: [{
                    message: 'you can\'t edit this comment, you\'re not owner of this comment',
                    field: 'comment'
                }]
            }
        }

        const updateInfo = await commentsMongoRepository.updateComment(commentId, input)

        return {
            status: ResultStatus.Success,
            data: updateInfo
        }
    },

    async deleteComment(commentId: string, userId: string): Promise<Result<boolean | { error?: string }>> {
        const foundComment = await commentsMongoRepository.findCommentById(commentId)

        if (!foundComment) return {
            status: ResultStatus.NotFound,
            errorMessage: {
                errorMessages: [{
                    message: 'the comment is not found',
                    field: 'comment'
                }]
            }
        }

        if (foundComment.commentatorInfo.userId !== userId) return {
            status: ResultStatus.Forbidden,
            errorMessage: {
                errorMessages: [{
                    message: 'you can\'t delete this comment, you\'re not owner of this comment',
                    field: 'comment'
                }]
            }
        }

        const deleteInfo = await commentsMongoRepository.deleteComment(commentId)
        return {
            status: ResultStatus.Success,
            data: deleteInfo
        }
    }
}
