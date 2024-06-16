import bcrypt from 'bcrypt'

export const bcryptService = {

    async generateHash(password: string) {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, passwordSalt)
        //const passwordHash = await this.generateHash(password, 10) //можно так, без отдельной генерации соли
        return passwordHash
    },

    async checkPassword(password: string, userHash: string) {
        const isCorrect = bcrypt.compare(password, userHash)
        return isCorrect
    }
}