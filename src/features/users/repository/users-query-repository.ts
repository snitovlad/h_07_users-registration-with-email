import { ObjectId } from "mongodb"
import { UserViewModel } from "../users-model/UserViewModel"
import { userCollection } from "../../../db/mongo-db"
import { UsersSanitizedQueryModel } from "../users-model/UsersSanitizedQueryModel"
import { UsersViewModel } from "../users-model/UsersViewModel"
//import { UserDBType } from "../../../db/db-type"
import { commonResponseGeneration } from "../../../helper/responseGeneration"
import { UserAccountDBType } from "../../../db/db-type"


export const usersQueryRepository = {

    async findUser(id: string): Promise<UserViewModel | null> {
        const user = await userCollection.findOne({ _id: new ObjectId(id) })
        if (!user) return null
        return this.mapToOutput(user)
    },

    async findAllUsers(sanitizedQuery: UsersSanitizedQueryModel): Promise<UsersViewModel | { error: string }> {
        // формирование фильтра (может быть вынесено во вспомогательный метод)
        //const byId = blogId ? { blogId: new ObjectId(blogId) } : {}

        const searchLoginTerm = sanitizedQuery.searchLoginTerm
            ? { login: { $regex: sanitizedQuery.searchLoginTerm, $options: 'i' } } //$options: 'i' - все равно какой регистр
            : {}

        const searchEmailTerm = sanitizedQuery.searchEmailTerm
            ? { email: { $regex: sanitizedQuery.searchEmailTerm, $options: 'i' } } //$options: 'i' - все равно какой регистр
            : {}

        const isExistSearchEmailTerm = searchEmailTerm && Object.keys(searchEmailTerm).length > 0
        const isExistSearchLoginTerm = searchLoginTerm && Object.keys(searchLoginTerm).length > 0
        let filter = {}

        if (isExistSearchEmailTerm) {
            filter = { ...searchEmailTerm }
        }
        if (isExistSearchLoginTerm) {
            filter = { ...searchLoginTerm }
        }
        if (isExistSearchEmailTerm && isExistSearchLoginTerm) {
            filter = { $or: [{ ...searchLoginTerm }, { ...searchEmailTerm }] }
        }


        // const filter: any = {};
        // // Проверяем, что searchLoginTerm не пустой объект
        // if (searchLoginTerm && Object.keys(searchLoginTerm).length > 0) {
        //     filter.$or = filter.$or || [];
        //     filter.$or.push({ ...searchLoginTerm });
        // }
        // // Проверяем, что searchEmailTerm не пустой объект
        // if (searchEmailTerm && Object.keys(searchEmailTerm).length > 0) {
        //     filter.$or = filter.$or || [];
        //     filter.$or.push({ ...searchEmailTerm });
        // }
        // // Если ни один из терминов не указан, удаляем $or
        // if (!filter.$or || filter.$or.length === 0) {
        //     delete filter.$or;
        // }

        try {
            // собственно запрос в бд (может быть вынесено во вспомогательный метод)
            const items = await userCollection
                .find(filter)
                .sort(sanitizedQuery.sortBy, sanitizedQuery.sortDirection)
                .skip((sanitizedQuery.pageNumber - 1) * sanitizedQuery.pageSize)
                .limit(sanitizedQuery.pageSize)
                .toArray() as UserAccountDBType[]

            // подсчёт элементов (может быть вынесено во вспомогательный метод)
            const totalCount = await userCollection.countDocuments(filter)

            // формирование ответа в нужном формате
            return {
                ...commonResponseGeneration(filter, sanitizedQuery, totalCount),
                items: items.map(this.mapToOutput)
            }
        } catch (e) {
            console.log(e)
            return { error: 'error with getting of users' }
        }
    },

    mapToOutput(user: UserAccountDBType): UserViewModel {
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt,
        }
    },

}
