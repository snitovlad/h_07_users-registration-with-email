import { clearTestDb, closeTestDb, connectToTestDb } from "./mongo-datasets"
import { req } from './test-helpers';
import { SETTINGS } from '../src/settings'
import { ObjectId } from "mongodb";
import { createUser, createUsers } from "./utils/createUsers";
import { CreateUserModel } from "../src/features/users/users-model/CreateUseerModel";

describe('/users', () => {

    beforeAll(async () => {
        await connectToTestDb()
        // await req.delete('/testing/all-data')

    })
    beforeEach(async () => {
        await clearTestDb()
    })
    afterAll(async () => {
        await closeTestDb()
    })

    it('should return 200 and empty array', async () => {
        const res = await req
            .get(SETTINGS.PATH.USERS)
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .expect(SETTINGS.HTTP_STATUSES.OK_200)
        console.log(res.body.items)
        expect(res.body.items.length).toBe(0)
    })

    it('should return 401 and empty array without autorization', async () => {
        const res = await req
            .get(SETTINGS.PATH.USERS)
            .expect(SETTINGS.HTTP_STATUSES.UNAUTHORIZED_401)
    })

    //не должен создать user с некорректными входными данными
    it('shouldn\'t create user with incorrect input data', async () => {
        const newUser: CreateUserModel = {
            login: 'name1',
            password: 'description1',
            email: 'https://it-com' //incorrect input data
        }
        const res = await req
            .post(SETTINGS.PATH.USERS)
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .send(newUser) // отправка данных
            .expect(SETTINGS.HTTP_STATUSES.BAD_REQUEST_400)

        const res1 = await req
            .get(SETTINGS.PATH.USERS)
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .expect(SETTINGS.HTTP_STATUSES.OK_200)
        expect(res1.body.items).toEqual([])
    })

    it('should get not empty array', async () => {
        //создаем нового user
        const newUser = await createUser()

        const res = await req
            .get(SETTINGS.PATH.USERS)
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .expect(SETTINGS.HTTP_STATUSES.OK_200)
        //console.log(res1.body)
        expect(res.body.items.length).toBe(1)
        //console.log('res.body.items[0]: ', res.body.items[0], 'newUser: ', newUser[0])
        expect(res.body.items[0]).toEqual(newUser)
    })

    //не должен создать user с не оригинальным login
    it('shouldn\'t create user with unoriginal login', async () => {
        //создаем нового user
        const newUser1 = await createUsers(1)
        const newUser2 = {
            ...newUser1[0],
            password: 'other',
            email: 'other@gmail.com'
        }

        const res2 = await req
            .post(SETTINGS.PATH.USERS)
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS }) //авторизация
            .send(newUser2) // отправка данных           
            .expect(SETTINGS.HTTP_STATUSES.BAD_REQUEST_400)

        const res3 = await req
            .get(SETTINGS.PATH.USERS)
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .expect(SETTINGS.HTTP_STATUSES.OK_200)
        //console.log(res1.body)
        expect(res3.body.items.length).toBe(1)
        expect(res3.body.items[0]).toEqual(newUser1[0])
    })

    //найдем useer по login или по email
    it('should return user with specific login', async () => {

        //создаем новых users
        const newUsers = await createUsers(5)

        const res3 = await req
            .get(SETTINGS.PATH.USERS)
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .expect(SETTINGS.HTTP_STATUSES.OK_200)
        expect(res3.body.items.length).toBe(5)

        const res4 = await req
            .get(SETTINGS.PATH.USERS + `?searchLoginTerm=${newUsers[3].login}`)
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .expect(SETTINGS.HTTP_STATUSES.OK_200)
        expect(res4.body.items[0]).toEqual(newUsers[3])
    })

    //отсортируем users по login в одну и в другую сторону
    it('should sorting blogs by name', async () => {
        //создаем новых users
        const newUsers = await createUsers(5)

        const res3 = await req
            .get(SETTINGS.PATH.USERS)
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .expect(SETTINGS.HTTP_STATUSES.OK_200)
        expect(res3.body.items.length).toBe(5)

        const res4 = await req
            .get(SETTINGS.PATH.USERS + '?sortBy=login&sortDirection=desc')
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .expect(SETTINGS.HTTP_STATUSES.OK_200)
        expect(res4.body.items[0]).toEqual(newUsers[4])
        expect(res4.body.items[4]).toEqual(newUsers[0])

        const res5 = await req
            .get(SETTINGS.PATH.USERS + '?sortBy=login&sortDirection=asc')
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .expect(SETTINGS.HTTP_STATUSES.OK_200)
        expect(res5.body.items[0]).toEqual(newUsers[0])
        expect(res5.body.items[4]).toEqual(newUsers[4])
    })

    //удаление user и возвращение пустого массива
    it(`should delete blog and return empty array`, async () => {
        //создаем user
        const newUser = await createUser()

        //проверили, что user есть в базе данных
        const res2 = await req
            .get(SETTINGS.PATH.USERS)
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .expect(SETTINGS.HTTP_STATUSES.OK_200)
        expect(res2.body.items).toEqual([newUser])

        //удалим его
        await req
            .delete(SETTINGS.PATH.USERS + '/' + newUser.id)
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .expect(SETTINGS.HTTP_STATUSES.N0_CONTENT_204)
        //проверим, что действительно удалился
        const res3 = await req
            .get(SETTINGS.PATH.USERS)
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .expect(SETTINGS.HTTP_STATUSES.OK_200)
        expect(res3.body.items).toEqual([])
    })

    //не должен удалить несуществующий user
    it(`shouldn't delete blog that not exist`, async () => {
        const nonExitingId = (new ObjectId()).toString()
        //создаем новый user
        const newUser = await createUser()

        //проверили, что user есть в базе данных
        const res2 = await req
            .get(SETTINGS.PATH.USERS)
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .expect(SETTINGS.HTTP_STATUSES.OK_200)
        expect(res2.body.items).toEqual([newUser])

        await req
            .delete(SETTINGS.PATH.USERS + '/' + nonExitingId)
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .expect(SETTINGS.HTTP_STATUSES.NOT_FOUND_404)
        //проверим, что ничего не удалилось
        await req
            .get(SETTINGS.PATH.USERS + `?searchLoginTerm=${newUser.login}`)
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .expect(200, res2.body)
    })
})