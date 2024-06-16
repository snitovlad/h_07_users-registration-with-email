import { ObjectId } from "mongodb";
import { UserAccountDBType } from "../../../db/db-type";
import { userCollection } from "../../../db/mongo-db";
// import { UserDBType } from "../../db/db-type";
// import { userCollection } from "../../db/mongo-db";

export const usersMongoRepository = {

    async createUser(user: UserAccountDBType): Promise<{ error?: string, id?: ObjectId }> {
        try {
            const insertedInfo = await userCollection.insertOne(user)
            //console.log(insertedInfo)
            return { id: insertedInfo.insertedId } //возвращаем объект
        } catch (e) {
            console.log(e)
            return { error: "Some error" }
        }
    },

    async deleteUser(id: string) {
        const deleteInfo = await userCollection.deleteOne({ _id: new ObjectId(id) })
        return deleteInfo.deletedCount === 1 //eсли 1 - значит true
    },

    async findUserById(id: string) {
        const user = await userCollection.findOne({ _id: new ObjectId(id) })
        return user
    },

    async findByLoginOrEmail(loginOrEmail: string) {
        const user = await userCollection.findOne({ $or: [{ email: loginOrEmail }, { login: loginOrEmail }] })
        return user
    },

    async findByConfirmationCode(code: string) {
        const user = await userCollection.findOne({ 'emailConfirmation.confirmationCode': code })
        return user
    },

    async updateEmailConfirmation(id: string) {
        let result = await userCollection.updateOne(
            { _id: new ObjectId(id) }, { $set: { 'emailConfirmation.isConfirmed': true } }
        )
        return result.modifiedCount === 1
    },

    async updateConfirmationCode(id: string, newConfirmationCode: string) {
        let result = await userCollection.updateOne(
            { _id: new ObjectId(id) }, { $set: { 'emailConfirmation.confirmationCode': newConfirmationCode } }
        )
        return result.modifiedCount === 1
    },

    async updateExpirationDate(id: string, newExpirationDate: Date) {
        let result = await userCollection.updateOne(
            { _id: new ObjectId(id) }, { $set: { 'emailConfirmation.expirationDate': newExpirationDate } }
        )
        return result.modifiedCount === 1
    },

}