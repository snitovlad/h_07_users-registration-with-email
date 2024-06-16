import { MongoMemoryServer } from 'mongodb-memory-server'
import { blogCollection, client, connectToDB, postCollection, userCollection } from "../src/db/mongo-db"
import { SETTINGS } from "../src/settings"
import { req } from "./test-helpers"
import { CreatePostModel } from "../src/features/posts/models/CreatePostModel"
import { CreateUserModel } from '../src/features/users/users-model/CreateUseerModel';
import { CreateBlogModel } from '../src/features/blogs/models/CreateBlogModel'


let testServer: MongoMemoryServer

export const connectToTestDb = async () => {
    try {
        testServer = await MongoMemoryServer.create() //запуск виртуального сервера с временной базой данных
        const uri = testServer.getUri() //получаем строку подключения
        await connectToDB(uri)
        console.log('Connected to local MongoDB for tests')
        return true
    } catch (e) {
        console.error('Failed to connect to local MongoDB', e)
        await client.close()
        return false
    }
}

export const clearTestDb = async () => {
    await blogCollection.deleteMany({})
    await postCollection.deleteMany({})
    await userCollection.deleteMany({})
    console.log('Local MongoDB is empty')
}

export const closeTestDb = async () => {
    await client.close()
    await testServer.stop()
    console.log('Local MongoDB closed')
}

//=======================================
export const createNewBlog: CreateBlogModel = {
    name: 'name1',
    description: 'description1',
    websiteUrl: 'https://it.com'
}
export const createNewBlog2: CreateBlogModel = {
    name: 'name2',
    description: 'description1',
    websiteUrl: 'https://it.com'
}
//==========================================
export const createNewEntity = async (newBlog: CreateBlogModel | CreatePostModel | CreateUserModel, path: string) => {
    return await req
        .post(path)
        .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS }) //авторизация
        .send(newBlog) // отправка данных           
        .expect(SETTINGS.HTTP_STATUSES.CREATED_201)
}
//=====================================================
export const createNewPost = (id: string): CreatePostModel => {
    const newPost = {
        title: 'newTitle',
        shortDescription: 'newShortDescription',
        content: 'newContent',
        blogId: id
    }
    return newPost
}

export const createNewPost2 = (id: string): CreatePostModel => {
    const newPost = {
        title: 'newTitle2',
        shortDescription: 'newShortDescription',
        content: 'newContent',
        blogId: id
    }
    return newPost
}
//==========================================================
export const createNewPostForBlog = {
    title: 'newTitle',
    shortDescription: 'newShortDescription',
    content: 'newContent',
}
//==============================================================
export const createNewUser1: CreateUserModel = {
    login: 'login1',
    password: 'password1',
    email: 'it1@gmail.com'
}

export const createNewUser2: CreateUserModel = {
    login: 'login2',
    password: 'password2',
    email: 'it2@gmail.com'
}