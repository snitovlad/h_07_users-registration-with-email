import { PostViewModel } from "../../../src/features/posts/models/PostViewModel"
import { SETTINGS } from "../../../src/settings"
import { req } from "../../test-helpers"


export const createPost = async (blogId: string): Promise<PostViewModel> => {
    const res = await req
        .post(SETTINGS.PATH.POSTS)
        //.auth(ADMIN_LOGIN, ADMIN_PASS)
        .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
        .send({
            title: 'newTitle',
            shortDescription: 'newShortDescription',
            content: 'newContent',
            blogId: blogId
        })
        .expect(SETTINGS.HTTP_STATUSES.CREATED_201)
    return res.body
}

export const createPosts = async (blogId: string, count: number) => {
    const posts = [] as PostViewModel[]
    for (let i = 1; i <= count; i++) {
        const res = await req
            .post(SETTINGS.PATH.POSTS)
            //.auth(ADMIN_LOGIN, ADMIN_PASS)
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .send({
                title: 'newTitle' + i,
                shortDescription: 'newShortDescription' + i,
                content: 'newContent' + i,
                blogId: blogId
            })
            .expect(SETTINGS.HTTP_STATUSES.CREATED_201)
        posts.push(res.body)
    }
    return posts
}
