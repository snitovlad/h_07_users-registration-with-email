import { CommentViewModel } from "../../../src/features/comments/models/CommentViewModel"
import { SETTINGS } from "../../../src/settings"
import { req } from "../../test-helpers"

export const createComment = async (token: string, postId: string): Promise<CommentViewModel> => {
    //const token = await accessToken()
    const res = await req
        .post(SETTINGS.PATH.POSTS + `/${postId}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            content: "some interesting content",
            //postId: postId
        })
        .expect(SETTINGS.HTTP_STATUSES.CREATED_201)
    return res.body
}

export const createComments = async (token: string, postId: string, count: number) => {
    //const token = await accessToken()
    const comments = [] as CommentViewModel[]
    for (let i = 1; i <= count; i++) {
        const res = await req
            .post(SETTINGS.PATH.POSTS + `/${postId}/comments`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                content: "some interesting content" + i,
                //postId: postId
            })
            .expect(SETTINGS.HTTP_STATUSES.CREATED_201)
        comments.push(res.body)
    }
    return comments
}