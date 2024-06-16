export type CommentViewModel = {
    id: string
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