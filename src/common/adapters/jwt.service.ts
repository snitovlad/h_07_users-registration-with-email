import { SETTINGS } from "../../settings"
import jwt from 'jsonwebtoken'

export const jwtService = {

    async createJWTToken(userId: string): Promise<string> {
        const token = jwt.sign({ userId: userId }, SETTINGS.JWT_SECRET, { expiresIn: SETTINGS.JWT_TIME })
        return token
    },

    async getUserIdByJWTToken(token: string): Promise<any> {
        try {
            //verify, кроме декодирования, еще проверяет на актульность срока годности - если что выбрасывает ошибку
            const result: any = jwt.verify(token, SETTINGS.JWT_SECRET)
            return result.userId //т.к. при создании использовали userId
        } catch (error) {
            console.error('Token verify some error')
            return null
        }

    },
}