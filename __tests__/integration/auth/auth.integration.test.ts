import { nodemailerService } from "../../../src/common/adapters/email-adapter"
import { ResultStatus } from "../../../src/common/types/resultCode"
import { authService } from "../../../src/features/auth/services/auth-service"
import { clearTestDb, closeTestDb, connectToTestDb } from "../../mongo-datasets"
import { testSeeder } from "../test-seeder/test-seeder"

describe('/auth INTEGRATION', () => {

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

    describe('UserRegistration', () => {  //тестируем регистрацию юзеров
        const registerUserUseCase = authService.registerUser

        //nodemailerService.sendEmail = jest.fn() //говорим, что это просто ф-ция. И все
        //сделаем то же, только с типизацией для jest.fu(). Это оптимально

        nodemailerService.sendEmail = jest.fn().mockImplementation(
            async (email: string, code: string, template: (code: string) => string): Promise<boolean> => true)

        // it('should mock nodemailerService.sendEmail', async () => {
        //     nodemailerService.sendEmail = jest.fn().mockImplementation(
        //         async (email: string, code: string, template: (code: string) => string): Promise<boolean> => true)
        //     // Реализация мок-функции
        // });

        it('should register with correct data', async () => {
            const { login, pass, email } = testSeeder.createUserDto();

            const result = await registerUserUseCase(login, pass, email)
            expect(result.status).toBe(ResultStatus.Success)
            //expect (result.data).toBe(st)
            expect(nodemailerService.sendEmail).toHaveBeenCalled()
            expect(nodemailerService.sendEmail).toHaveBeenCalledTimes(1)
        })

        it('should register user twice', async () => {
            const { login, pass, email } = testSeeder.createUserDto();
            //зарегистрируем нашего пользователя
            const user = await testSeeder.registerUser({ login, pass, email })

            //пытаемся зарегистрировать юзера вторй раз
            const result = await registerUserUseCase(login, pass, email)
            //должна прийти ошибка, что такой юзер уже существует
            expect(result.status).toBe(ResultStatus.BadRequest)
            //expect (result.data).toBe(st)
            expect(result.data).toBeUndefined()
        })
    })

    describe('Confirm email', () => {
        const confirmEmailUseCase = authService.confirmEmail

        it('shouldn\'t confirm email if user does not exist', async () => {
            const code = 'test'
            const result = await confirmEmailUseCase(code)
            //юзера не создавали, в базе ничего нет
            expect(result).toBeFalsy()
        })

        it('shouldn\'t confirm email which is confirmed', async () => {

            //создаем юзера
            const { login, pass, email } = testSeeder.createUserDto();
            const user = await testSeeder.registerUser({ login, pass, email, isConfirmed: true })

            const result = await confirmEmailUseCase(user.emailConfirmation.confirmationCode)
            expect(result).toBeFalsy()
        })

        it('shouldn\'t confirm email with expared code', async () => {

            //создаем юзера
            const { login, pass, email } = testSeeder.createUserDto();
            const user = await testSeeder.registerUser({ login, pass, email, expirationDate: new Date() })

            const result = await confirmEmailUseCase(user.emailConfirmation.confirmationCode)
            expect(result).toBeFalsy()
        })

        it('should confirm user', async () => {

            //создаем юзера
            const { login, pass, email } = testSeeder.createUserDto();
            const user = await testSeeder.registerUser({ login, pass, email })

            const result = await confirmEmailUseCase(user.emailConfirmation.confirmationCode)
            expect(result).toBeTruthy()
        })



    })
})