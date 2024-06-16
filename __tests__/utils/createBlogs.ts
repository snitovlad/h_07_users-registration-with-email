import { BlogViewModel } from "../../src/features/blogs/models/BlogViewModel";
import { SETTINGS } from "../../src/settings"
import { req } from '../test-helpers';

export const createBlog = async (): Promise<BlogViewModel> => {
    const res = await req
        .post(SETTINGS.PATH.BLOGS)
        //.auth(ADMIN_LOGIN, ADMIN_PASS)
        .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
        .send({
            name: 'name',
            description: 'description',
            websiteUrl: 'https://blog.com'
        })
        .expect(SETTINGS.HTTP_STATUSES.CREATED_201)
    return res.body
}

export const createBlogs = async (count: number) => {
    const blogs = [] as BlogViewModel[]
    for (let i = 1; i <= count; i++) {
        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            //.auth(ADMIN_LOGIN, ADMIN_PASS)
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .send({
                name: 'name' + i,
                description: 'description' + i,
                websiteUrl: `https://blog${i}.com`
            })
            .expect(SETTINGS.HTTP_STATUSES.CREATED_201)
        blogs.push(res.body)
    }
    return blogs
}
