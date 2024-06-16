import { clearTestDb, closeTestDb, connectToTestDb } from "./mongo-datasets"
import { req } from './test-helpers';
import { SETTINGS } from '../src/settings'
import { accessOtherToken, accessToken, createUser } from "./utils/createUsers";
import { createBlog } from "./utils/createBlogs";
import { createPost } from "./utils/createPosts";
import { createComment, createComments } from "./utils/createComments";
import { ObjectId } from "mongodb";



describe('/auth', () => {

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

    //должен создаться комментарий для определенного поста
    it('should create comment for post by id', async () => {
        //создаем юзера, аутентифицируем и получаем токен
        const token = await accessToken()
        //setTimeout(() => { }, 1000)
        const newBlog = await createBlog()
        const newPost = await createPost(newBlog.id)
        const res = await req
            .post(SETTINGS.PATH.POSTS + `/${newPost.id}/comments`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                content: "some interesting content"
            })
            .expect(SETTINGS.HTTP_STATUSES.CREATED_201)
        //console.log('res.body: ', res.body)
        expect(res.body.content).toEqual("some interesting content")
    })

    //не должен создаться комментарий при некорректных входных данных
    it('shouldn\'t create comment with incorrect input values', async () => {
        //создаем юзера, аутентифицируем и получаем токен
        const token = await accessToken()
        //setTimeout(() => { }, 1000)
        const newBlog = await createBlog()
        const newPost = await createPost(newBlog.id)
        await req
            .post(SETTINGS.PATH.POSTS + `/${newPost.id}/comments`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                content: "some content"
            })
            .expect(SETTINGS.HTTP_STATUSES.BAD_REQUEST_400)
    })

    //не должен создаться комментарий для несуществующего поста
    it('shouldn\'t create comment for non-existent post', async () => {
        //создаем юзера, аутентифицируем и получаем токен
        const token = await accessToken()
        //setTimeout(() => { }, 1000)
        const newBlog = await createBlog()
        const newPost = await createPost(newBlog.id)
        await req
            .post(SETTINGS.PATH.POSTS + `/${(new ObjectId()).toString()}/comments`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                content: "some interesting content"
            })
            .expect(SETTINGS.HTTP_STATUSES.NOT_FOUND_404)
    })

    //должены получить комментарии для поста
    it('should get comments for post', async () => {
        //создаем юзера, аутентифицируем и получаем токен
        const token = await accessToken()
        const newBlog = await createBlog()
        const newPost = await createPost(newBlog.id)
        const newComments = await createComments(token, newPost.id, 5)
        const res = await req
            .get(SETTINGS.PATH.POSTS + `/${newPost.id}/comments`)
            //.set('Authorization', `Bearer ${token}`)
            .expect(SETTINGS.HTTP_STATUSES.OK_200)

        expect(res.body.items.length).toBe(5)
    })

    //не должены получить комментарии для несуществующего поста поста
    it('shouldn\'t get comments for non-existent post', async () => {
        //создаем юзера, аутентифицируем и получаем токен
        const token = await accessToken()
        const newBlog = await createBlog()
        const newPost = await createPost(newBlog.id)
        const newComments = await createComments(token, newPost.id, 5)
        await req
            .get(SETTINGS.PATH.POSTS + `/${(new ObjectId()).toString()}/comments`)
            //.set('Authorization', `Bearer ${token}`)
            .expect(SETTINGS.HTTP_STATUSES.NOT_FOUND_404)
    })

    //должены получить комментарии для поста и отсортировать их по дате 
    it('should get comments for post and sort their for date from old', async () => {
        //создаем юзера, аутентифицируем и получаем токен
        const token = await accessToken()
        const newBlog = await createBlog()
        const newPost = await createPost(newBlog.id)
        const newComments = await createComments(token, newPost.id, 5)
        const res1 = await req
            //сортируем от нового вниз к старому
            .get(SETTINGS.PATH.POSTS + `/${newPost.id}/comments` + '?sortDirection=desc')
            .expect(SETTINGS.HTTP_STATUSES.OK_200)
        expect(res1.body.items.length).toBe(5)
        expect(res1.body.items[0]).toEqual(newComments[4])

        //сортируем от старого вниз к новому
        const res2 = await req
            .get(SETTINGS.PATH.POSTS + `/${newPost.id}/comments` + '?sortDirection=asc')
            .expect(SETTINGS.HTTP_STATUSES.OK_200)
        expect(res2.body.items[0]).toEqual(newComments[0])
    })

    //должены обновить свой комментарий для поста
    it('should update myself comment for a post', async () => {
        //создаем юзера, аутентифицируем и получаем токен
        const token = await accessToken()
        const newBlog = await createBlog()
        const newPost = await createPost(newBlog.id)
        const newComment = await createComment(token, newPost.id)
        await req
            .put(SETTINGS.PATH.COMMENTS + `/${newComment.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                content: "some really interesting content"
            })
            .expect(SETTINGS.HTTP_STATUSES.N0_CONTENT_204)

        //проверим обновление
        const res = await req
            .get(SETTINGS.PATH.COMMENTS + `/${newComment.id}`)
            .expect(SETTINGS.HTTP_STATUSES.OK_200)
        expect(res.body.content).toEqual("some really interesting content")

        //запросим неверный commentId
        await req
            .get(SETTINGS.PATH.COMMENTS + `/${(new ObjectId()).toString()}`)
            .expect(SETTINGS.HTTP_STATUSES.NOT_FOUND_404)
    })

    //не должен обновить не свой комментарий для поста
    it('should update not myself comment for post', async () => {
        //создаем юзера, аутентифицируем и получаем токен
        const token = await accessToken()
        const newBlog = await createBlog()
        const newPost = await createPost(newBlog.id)
        const newComment = await createComment(token, newPost.id)

        //создаем еще одного юзера, аутентифицируем и получаем токен
        const token1 = await accessOtherToken()
        await req
            .put(SETTINGS.PATH.COMMENTS + `/${newComment.id}`)
            .set('Authorization', `Bearer ${token1}`)
            .send({
                content: "some really interesting content"
            })
            .expect(SETTINGS.HTTP_STATUSES.FORBIDDEN_403)

        //проверим, что не обновилось
        const res = await req
            .get(SETTINGS.PATH.COMMENTS + `/${newComment.id}`)
            .expect(SETTINGS.HTTP_STATUSES.OK_200)
        expect(res.body.content).toEqual(newComment.content)
    })

    //не должен обновить свой комментарий некорректными данными для поста
    it('should update myself comment by incorrect values for post', async () => {
        //создаем юзера, аутентифицируем и получаем токен
        const token = await accessToken()
        const newBlog = await createBlog()
        const newPost = await createPost(newBlog.id)
        const newComment = await createComment(token, newPost.id)

        await req
            .put(SETTINGS.PATH.COMMENTS + `/${newComment.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                content: "so"
            })
            .expect(SETTINGS.HTTP_STATUSES.BAD_REQUEST_400)

        //проверим, что не обновилось
        const res = await req
            .get(SETTINGS.PATH.COMMENTS + `/${newComment.id}`)
            .expect(SETTINGS.HTTP_STATUSES.OK_200)
        expect(res.body.content).toEqual(newComment.content)
    })

    //должены удалить свой комментарий для поста
    it('should delete myself comment for a post', async () => {
        //создаем юзера, аутентифицируем и получаем токен
        const token = await accessToken()
        const newBlog = await createBlog()
        const newPost = await createPost(newBlog.id)
        const newComment = await createComment(token, newPost.id)
        await req
            .delete(SETTINGS.PATH.COMMENTS + `/${newComment.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(SETTINGS.HTTP_STATUSES.N0_CONTENT_204)

        //проверим удаление
        const res = await req
            .get(SETTINGS.PATH.COMMENTS + `/${newComment.id}`)
            .expect(SETTINGS.HTTP_STATUSES.NOT_FOUND_404)
        expect(res.body).toEqual({})
    })

    //не должен удалить не свой комментарий для поста
    it('should delete not myself comment for post', async () => {
        //создаем юзера, аутентифицируем и получаем токен
        const token = await accessToken()
        const newBlog = await createBlog()
        const newPost = await createPost(newBlog.id)
        const newComment = await createComment(token, newPost.id)

        //создаем еще одного юзера, аутентифицируем и получаем токен
        const token1 = await accessOtherToken()
        await req
            .delete(SETTINGS.PATH.COMMENTS + `/${newComment.id}`)
            .set('Authorization', `Bearer ${token1}`)
            .expect(SETTINGS.HTTP_STATUSES.FORBIDDEN_403)

        //проверим, что не удалилось
        const res = await req
            .get(SETTINGS.PATH.COMMENTS + `/${newComment.id}`)
            .expect(SETTINGS.HTTP_STATUSES.OK_200)
        expect(res.body.content).toEqual(newComment.content)
    })

    //не должен удалить не существующий комментарий для поста
    it('should delete non-existent comment for post', async () => {
        //создаем юзера, аутентифицируем и получаем токен
        const token = await accessToken()
        const newBlog = await createBlog()
        const newPost = await createPost(newBlog.id)
        const newComment = await createComment(token, newPost.id)

        await req
            .delete(SETTINGS.PATH.COMMENTS + `/${(new ObjectId()).toString()}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(SETTINGS.HTTP_STATUSES.NOT_FOUND_404)

        //проверим, что не удалилось
        const res = await req
            .get(SETTINGS.PATH.COMMENTS + `/${newComment.id}`)
            .expect(SETTINGS.HTTP_STATUSES.OK_200)
        expect(res.body.content).toEqual(newComment.content)
    })

    //не авторизирован для удаления своего комментария для поста
    it('should delete myself comment for a post without autorization', async () => {
        //создаем юзера, аутентифицируем и получаем токен
        const token = await accessToken()
        const newBlog = await createBlog()
        const newPost = await createPost(newBlog.id)
        const newComment = await createComment(token, newPost.id)
        await req
            .delete(SETTINGS.PATH.COMMENTS + `/${newComment.id}`)
            //.set('Authorization', `Bearer ${token}`)
            .expect(SETTINGS.HTTP_STATUSES.UNAUTHORIZED_401)

        //проверим удаление
        const res = await req
            .get(SETTINGS.PATH.COMMENTS + `/${newComment.id}`)
            .expect(SETTINGS.HTTP_STATUSES.OK_200)
        expect(res.body).toEqual(newComment)
    })

})