import { clearTestDb, closeTestDb, connectToTestDb } from "../mongo-datasets"
import { req } from '../test-helpers';
import { SETTINGS } from '../../src/settings'
import { createUser } from "./utils/createUsers";

describe('/auth', () => {

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

    //должен авторизоваться
    it('should get autorization', async () => {
        //создаем нового user
        // const newUser1 = createNewUser1
        // const res = await createNewEntity(newUser1, SETTINGS.PATH.USERS)
        const newUser = await createUser()

        const authUser = {
            loginOrEmail: `${newUser.login}`,
            password: 'testPass'
        }
        await req
            .post(SETTINGS.PATH.AUTH + '/login')
            .send(authUser)
            .expect(SETTINGS.HTTP_STATUSES.OK_200)
    })

    //не должен авторизоваться
    it('shouldn\'t get autorization', async () => {
        //создаем нового user
        const newUser = await createUser()

        const authUser = {
            loginOrEmail: `${newUser.login}`,
            password: 'somePassword',
        }
        await req
            .post(SETTINGS.PATH.AUTH + '/login')
            .send(authUser)
            .expect(SETTINGS.HTTP_STATUSES.UNAUTHORIZED_401)
    })

    //не должен авторизоваться из-за некорректных данных
    it('shouldn\'t get autorization because uncorrect data', async () => {
        //создаем нового user
        const newUser = await createUser()

        const authUser = {
            loginOrEmail: `ghj@hgjhgj-hgj`, //некорректные данные
            password: 'testPass',
        }
        await req
            .post(SETTINGS.PATH.AUTH + '/login')
            .send(authUser)
            .expect(SETTINGS.HTTP_STATUSES.BAD_REQUEST_400)
    })

    //должен получить корректные данные пользователя при запросе на /me
    it('should return correct data of user', async () => {
        //создаем нового user
        const newUser = await createUser()

        const authUser = {
            loginOrEmail: `${newUser.login}`,
            password: 'testPass'
        }
        const res = await req
            .post(SETTINGS.PATH.AUTH + '/login')
            .send(authUser)
            .expect(SETTINGS.HTTP_STATUSES.OK_200)

        const token = res.body.accessToken

        // Выполняем запрос /auth/me с токеном авторизации
        const meRes = await req
            .get(SETTINGS.PATH.AUTH + '/me')
            .set('Authorization', `Bearer ${token}`)
            .expect(SETTINGS.HTTP_STATUSES.OK_200);
        expect(meRes.body.email).toEqual(newUser.email)
        expect(meRes.body.login).toEqual(newUser.login)
        expect(meRes.body.userId).toEqual(newUser.id)
    })
})