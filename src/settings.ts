import { config } from 'dotenv' //забираем спецфункцию из библиотеки dotenv
config() // добавление переменных из файла .env в process.env

// const buff2 = Buffer.from(process.env.ADMIN_AUTH, 'utf8')
//     const codedAuth = buff2.toString('base64')

export const SETTINGS = {
    // все хардкодные значения должны быть здесь, для удобства их изменения
    PORT: process.env.PORT || 3004,
    PATH: {
        AUTH: '/auth',
        BLOGS: '/blogs',
        POSTS: '/posts',
        USERS: '/users',
        COMMENTS: '/comments',
        TESTING: '/testing/all-data'
    },
    DB_NAME: process.env.DB_NAME || '',
    BLOG_COLLECTION_NAME: process.env.BLOG_COLLECTION_NAME || '',
    POST_COLLECTION_NAME: process.env.POST_COLLECTION_NAME || '',
    USER_COLLECTION_NAME: process.env.USER_COLLECTION_NAME || '',
    COMMENT_COLLECTION_NAME: process.env.COMMENT_COLLECTION_NAME || '',
    MONGO_URL: process.env.MONGO_URL || 'mongodb://0.0.0.0:27017',
    ADMIN_AUTH: process.env.ADMIN_AUTH || '',
    ADMIN_AUTH_FOR_TESTS: process.env.ADMIN_AUTH_FOR_TESTS || '',
    JWT_SECRET: process.env.JWT_SECRET || '123',
    JWT_TIME: process.env.JWT_TIME || '1h',
    EMAIL: process.env.EMAIL || '',
    EMAIL_PASS: process.env.EMAIL_PASS || '',

    HTTP_STATUSES: {
        OK_200: 200,
        CREATED_201: 201,
        N0_CONTENT_204: 204,
        BAD_REQUEST_400: 400,
        UNAUTHORIZED_401: 401,
        FORBIDDEN_403: 403,
        NOT_FOUND_404: 404,
        INTERNAL_SERVER_ERROR_500: 500
    }
}


//export const ADMIN_AUTH = 'YWRtaW46cXdlcnR5'
//export const ADMIN_AUTH = process.env.ADMIN_AUTH || ''
