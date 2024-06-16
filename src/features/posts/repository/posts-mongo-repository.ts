import { ObjectId } from "mongodb"
import { PostDBType } from "../../../db/db-type"
import { postCollection } from "../../../db/mongo-db"
import { UpdatePostModel } from "../models/UpdatePostModel"


export const postsMongoRepository = {

    async createPost(newPost: PostDBType): Promise<{ error?: string, id?: ObjectId }> {

        try {
            const insertedInfo = await postCollection.insertOne(newPost)
            console.log(insertedInfo)
            return { id: insertedInfo.insertedId } //возвращаем объект
        } catch (e: any) {
            // log
            return { error: e.message }
        }
    },

    async deletePost(id: string): Promise<boolean> {

        const deleteInfo = await postCollection.deleteOne({ _id: new ObjectId(id) })
        return deleteInfo.deletedCount === 1 //eсли 1 - значит true
    },

    async updatePost(id: string, input: UpdatePostModel): Promise<boolean | { error?: string }> {

        // let foundPost = await postsQueryRepository.findPost(id)
        // const updatePost = { ...foundPost, ...input }
        try {
            const updateInfo = await postCollection.updateOne({ _id: new ObjectId(id) }, { $set: { ...input } })
            return updateInfo.matchedCount === 1
        } catch (e: any) {
            // log
            return { error: e.message }
        }
    },

}
