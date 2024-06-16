import { ObjectId, WithId } from "mongodb"

export type BlogDBType = {
    _id: ObjectId
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

export type PostDBType = {
    _id: ObjectId
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string | undefined
    createdAt: string
}

export type EmailConfigurationType = {
    isConfirmed: boolean
    confirmationCode: string
    expirationDate: Date
}

export type UserAccountType = {
    login: string
    email: string
    createdAt: string
    passwordHash: string
}

export type UserAccountDBType = WithId<{
    //accountData: UserAccountType
    login: string
    email: string
    createdAt: string
    passwordHash: string
    emailConfirmation: EmailConfigurationType
}>

// export type UserDBType = {
//     _id: ObjectId
//     login: string
//     email: string
//     createdAt: string
//     passwordHash: string
// }

// export type UserAccountDBType = {
//     _id: ObjectId
//     login: string
//     email: string
//     createdAt: string
//     passwordHash: string
//     emailConfirmation: {
//         isConfirmed: boolean
//         confirmationCode: string
//         expirationDate: Date
//     }
// }

export type CommentDBType = {
    _id: ObjectId
    postId: string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string | undefined
    }
    createdAt: string
}

// type CommentatorInfo = {
//     userId: string
//     userLogin: string
// }