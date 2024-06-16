import { ObjectId } from "mongodb";
import { BlogDBType } from "../../../db/db-type";
import { blogCollection } from "../../../db/mongo-db";
import { UpdateBlogModel } from "../models/UpdateBlogModel";

export const blogsMongoRepository = {

    async createdBlog(newBlog: BlogDBType): Promise<{ error?: string, id?: ObjectId }> {

        try {
            const insertedInfo = await blogCollection.insertOne(newBlog)
            return { id: insertedInfo.insertedId } //возвращаем объект
        } catch (e: any) {
            // log
            return { error: e.message }
        }
    },

    async deleteBlog(id: string): Promise<boolean> {

        const deleteInfo = await blogCollection.deleteOne({ _id: new ObjectId(id) })
        return deleteInfo.deletedCount === 1 //eсли 1 - значит true
    },

    async updateBlog(id: string, input: UpdateBlogModel): Promise<boolean | { error?: string }> {

        try {
            const updateInfo = await blogCollection.updateOne({ _id: new ObjectId(id) }, { $set: { ...input } })
            return updateInfo.matchedCount === 1
            //использовали matchedCount, а не modifiedCounter, т.к. если обновим "orange" на "orange"
            //то modifiedCounter вернет 0 (хотя обновление произошло), а matchedCount просто проверила
            //наличие документа на обновление и вернет 1
        } catch (e: any) {
            // log
            return { error: e.message }
        }
    },

}