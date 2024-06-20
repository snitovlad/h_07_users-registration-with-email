import { UserViewModel } from "../../../src/features/users/users-model/UserViewModel"
import { SETTINGS } from "../../../src/settings"
import { req } from "../../test-helpers"

export const createUser = async () => {
    const res = await req
        .post(SETTINGS.PATH.USERS)
        //.auth(ADMIN_LOGIN, ADMIN_PASS)
        .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
        .send({
            login: 'testUser',
            password: 'testPass',
            email: 'test@gmail.com'
        })
        .expect(SETTINGS.HTTP_STATUSES.CREATED_201)
    return res.body
}

export const createOtherUser = async () => {
    const res = await req
        .post(SETTINGS.PATH.USERS)
        //.auth(ADMIN_LOGIN, ADMIN_PASS)
        .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
        .send({
            login: 'OtherUser',
            password: 'testOtherPass',
            email: 'testOther@gmail.com'
        })
        .expect(SETTINGS.HTTP_STATUSES.CREATED_201)
    return res.body
}

export const createUsers = async (count: number) => {
    const users = [] as UserViewModel[]
    for (let i = 1; i <= count; i++) {
        const res = await req
            .post(SETTINGS.PATH.USERS)
            //.auth(ADMIN_LOGIN, ADMIN_PASS)
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .send({
                login: 'testUser' + i,
                password: 'testPass' + i,
                email: `test${i}@gmail.com`
            })
            .expect(SETTINGS.HTTP_STATUSES.CREATED_201)
        users.push(res.body)
    }
    return users
}

//создаем юзера, аутентифицируем и получаем токен
export const accessToken = async (): Promise<string> => {
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
    return token
}

//создаем юзера, аутентифицируем и получаем токен
export const accessOtherToken = async (): Promise<string> => {
    const newUser = await createOtherUser()
    const authUser = {
        loginOrEmail: `${newUser.login}`,
        password: 'testOtherPass'
    }
    const res = await req
        .post(SETTINGS.PATH.AUTH + '/login')
        .send(authUser)
        .expect(SETTINGS.HTTP_STATUSES.OK_200)
    const token = res.body.accessToken
    return token
}
