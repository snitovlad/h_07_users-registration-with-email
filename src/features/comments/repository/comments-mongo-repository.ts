import { ObjectId } from "mongodb"
import { CommentDBType } from "../../../db/db-type"
import { commentCollection } from "../../../db/mongo-db"
import { UpdateCommentModel } from "../models/UpdareCommentModel"

export const commentsMongoRepository = {

    async findCommentById(id: string): Promise<CommentDBType | null> {
        const comment = await commentCollection.findOne({ _id: new ObjectId(id) })
        if (!comment) return null
        return comment
    },

    async createComment(comment: CommentDBType): Promise<{ error?: string, id?: ObjectId }> {
        try {
            const insertedInfo = await commentCollection.insertOne(comment)
            //console.log(insertedInfo)
            return { id: insertedInfo.insertedId } //возвращаем объект
        } catch (e) {
            console.log(e)
            return { error: "Some error" }
        }
    },

    async updateComment(commentId: string, input: UpdateCommentModel): Promise<boolean | { error?: string }> {

        try {
            const updateInfo = await commentCollection.updateOne({ _id: new ObjectId(commentId) }, { $set: { ...input } })
            return updateInfo.matchedCount === 1
        } catch (e: any) {
            console.error("comment is not update")
            return { error: e.message }
        }
    },

    async deleteComment(commentId: string): Promise<boolean | { error?: string }> {

        try {
            const deleteInfo = await commentCollection.deleteOne({ _id: new ObjectId(commentId) })
            return deleteInfo.deletedCount === 1 //eсли 1 - значит true
        } catch (e: any) {
            console.error("comment is not deleted")
            return { error: e.message }
        }
    }
}