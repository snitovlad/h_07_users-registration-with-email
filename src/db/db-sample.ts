import { Db, MongoClient } from "mongodb";
import { SETTINGS } from "../settings";
import { BlogDBType, CommentDBType, PostDBType, UserAccountDBType } from "./db-type";

export const db = {

    client: {} as MongoClient,  //клиент, который будет создаваться

    getDBName(): Db {
        return this.client.db(SETTINGS.DB_NAME)  //к какой базе данных подключаемся
    },

    async connectToDB(MONGO_URL: string) {  //MONGO_URL легко будет подменить
        try {
            this.client = new MongoClient(MONGO_URL)  //создаем пользователя, к-рый подключается к базе данных
            await this.client.connect()  //коннектимся
            //command позволяет отправлять произвольные команды на сервер (здесь ping, чтобы проверить работу сервера)
            await this.getDBName().command({ ping: 1 }) //вернет {ok: 1} если все хорошо  
            return true
        } catch (e: unknown) {
            console.log("Can't connect to mongo server", e)
            await this.client.close() //отключаем клиента если все плохо
            return false
        }
    },

    async stopDB() { //стопаем базу данных
        await this.client.close()
        console.log("Connection successful closed")
    },

    async dropDB() {  //дропаем (очищаем) базу данных
        try {
            //await this.getDBName().dropDatabase()  //если в нашем облачном атласе дали себе права администратора
            const collections = await this.getDBName().listCollections().toArray() //получили массив коллекций
            for (const collection of collections) {
                const collectionName = collection.name
                await this.getDBName().collection(collectionName).deleteMany({})
            }
        } catch (e: unknown) {
            console.log('Error in drop db: ', e)
            await this.stopDB()
        }
    },

    getCollections() { //получение коллекций
        return {
            blogCollection: this.getDBName().collection<BlogDBType>(SETTINGS.BLOG_COLLECTION_NAME),  //создаем коллекцию
            postCollection: this.getDBName().collection<PostDBType>(SETTINGS.POST_COLLECTION_NAME),
            userCollection: this.getDBName().collection<UserAccountDBType>(SETTINGS.USER_COLLECTION_NAME),
            commentCollection: this.getDBName().collection<CommentDBType>(SETTINGS.COMMENT_COLLECTION_NAME)
        }
    }
}