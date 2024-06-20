import { add } from "date-fns/add"
import { UserAccountDBType } from "../../../src/db/db-type"
import { randomUUID } from "crypto"
import { userCollection } from "../../../src/db/mongo-db"
import { ObjectId } from "mongodb"

type RegisterUserType = {
    login: string
    pass: string
    email: string
    code?: string
    expirationDate?: Date
    isConfirmed?: boolean
}

export const testSeeder = {

    createUserDto() {
        return {
            login: 'testing',
            email: 'test@gmail.com',
            pass: '123456789'
        }
    },

    createUserDtos(count: number) {
        const users = [] as RegisterUserType[]
        for (let i = 1; i <= count; i++) {
            users.push({
                login: 'testing' + i,
                email: `test${i}@gmail.com`,
                pass: '123456789'
            })
        }
        return users
    },

    async registerUser({
        login,
        pass,
        email,
        code,
        expirationDate,
        isConfirmed
    }: RegisterUserType): Promise<UserAccountDBType> {

        const newUser = {
            _id: new ObjectId(),
            login,
            email,
            createdAt: new Date().toISOString(),
            passwordHash: pass,
            emailConfirmation: {
                confirmationCode: code ?? randomUUID(),
                expirationDate: expirationDate ?? add(new Date(), {
                    minutes: 30
                }),
                isConfirmed: isConfirmed ?? false
            }
        }
        const res = await userCollection.insertOne({ ...newUser })
        return newUser

    }
}
