import { blogCollection, commentCollection, postCollection, userCollection } from "../../../db/mongo-db";

// export const deleteAllDataRepository = {
//     async deleteAllData(): Promise<{ success?: boolean }> {

//         try {
//             await postCollection.deleteMany({})
//             await blogCollection.deleteMany({})

//             await userCollection.deleteMany({})
//             await commentCollection.deleteMany({})
//             return { success: true }
//         } catch (e) {
//             throw new Error('Failed to delete all data')
//         }
//     }
// }

//чтобы очищались все обязательно
export const deleteAllDataRepository = {
    async deleteAllData(): Promise<{ success?: boolean }> {
        try {
            await Promise.all([
                postCollection.deleteMany({}),
                blogCollection.deleteMany({}),
                userCollection.deleteMany({}),
                commentCollection.deleteMany({})
            ]);
            return { success: true }
        } catch (e) {
            throw new Error('Failed to delete all data')
        }
    }
}
