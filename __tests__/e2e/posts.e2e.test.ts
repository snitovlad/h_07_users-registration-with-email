import { req } from '../test-helpers'
import { SETTINGS } from '../../src/settings'
import { clearTestDb, closeTestDb, connectToTestDb, createNewBlog, createNewEntity, createNewPost, createNewPost2 } from '../mongo-datasets'
import { ObjectId } from 'mongodb'
import { CreatePostModel } from '../../src/features/posts/models/CreatePostModel'
import { UpdatePostModel } from '../../src/features/posts/models/UpdatePostModel'


describe('/posts', () => {

    beforeAll(async () => {
        await connectToTestDb()
    })
    beforeEach(async () => {
        await clearTestDb()
    })
    afterAll(async () => {
        await closeTestDb()
    })



    it('should return 200 and empty array', async () => {
        const res = await req
            .get(SETTINGS.PATH.POSTS)
            .expect(SETTINGS.HTTP_STATUSES.OK_200)
        //console.log(res.body)
        expect(res.body.items.length).toBe(0)
    })

    it('should get not empty array', async () => {
        //создаем новый блог
        const newBlog = createNewBlog
        const res = await createNewEntity(newBlog, SETTINGS.PATH.BLOGS)
        //создаем новый пост
        const newPost = createNewPost(res.body.id)
        const res1 = await createNewEntity(newPost, SETTINGS.PATH.POSTS)

        //setPostsDB(dataset1)
        const res2 = await req
            .get(SETTINGS.PATH.POSTS)
            .expect(SETTINGS.HTTP_STATUSES.OK_200)
        //console.log(res.body)
        expect(res2.body.items.length).toBe(1)
        expect(res2.body.items[0]).toEqual(res1.body)
    })

    it('should return 404 for not exiting post', async () => {
        const res = await req
            .get(SETTINGS.PATH.POSTS + '/' + (new ObjectId()).toString()) //нет такого id
            .expect(SETTINGS.HTTP_STATUSES.NOT_FOUND_404) // проверка на ошибку
    })

    //отсортируем посты по title в одну и в другую сторону
    it('should sorting blogs by title', async () => {
        //создаем два блога
        const newBlog = createNewBlog
        const res = await createNewEntity(newBlog, SETTINGS.PATH.BLOGS)
        const newPost1 = createNewPost(res.body.id)
        const newPost2 = createNewPost2(res.body.id)
        const res1 = await createNewEntity(newPost1, SETTINGS.PATH.POSTS)
        const res2 = await createNewEntity(newPost2, SETTINGS.PATH.POSTS)

        const res3 = await req
            .get(SETTINGS.PATH.BLOGS + '/' + res.body.id + '/posts' + '?sortBy=title&sortDirection=desc')
            .expect(SETTINGS.HTTP_STATUSES.OK_200)
        expect(res3.body.items.length).toBe(2)
        expect(res3.body.items[0]).toEqual(res2.body)
        expect(res3.body.items[1]).toEqual(res1.body)

        const res4 = await req
            .get(SETTINGS.PATH.BLOGS + '/' + res.body.id + '/posts' + '?sortBy=title&sortDirection=asc')
            .expect(SETTINGS.HTTP_STATUSES.OK_200)
        expect(res4.body.items[0]).toEqual(res1.body)
        expect(res4.body.items[1]).toEqual(res2.body)
    })

    //создание нового поста
    it('should create post', async () => {

        //создаем новый блог
        const newBlog = createNewBlog
        const res = await createNewEntity(newBlog, SETTINGS.PATH.BLOGS)
        //создаем новый пост
        const newPost = createNewPost(res.body.id)
        const res1 = await createNewEntity(newPost, SETTINGS.PATH.POSTS)

        expect(res1.body.title).toBe(newPost.title)
        expect(res1.body.shortDescription).toBe(newPost.shortDescription)
        expect(res1.body.content).toEqual(newPost.content)
        expect(res1.body.blogId).toEqual(res.body.id)
        expect(res1.body.blogName).toEqual(res.body.name)
    })

    it('shouldn\'t create post with incorrect blogId', async () => {
        //создаем новый блог
        const newBlog = createNewBlog
        const res = await createNewEntity(newBlog, SETTINGS.PATH.BLOGS)
        //создаем новый пост
        const newPost: CreatePostModel = {
            title: 'title1',
            shortDescription: 'shortDescription1',
            content: 'content1',
            blogId: (new ObjectId()).toString(), //incorrect input content
        }
        const res1 = await req
            .post(SETTINGS.PATH.POSTS)
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .send(newPost) // отправка данных
            .expect(SETTINGS.HTTP_STATUSES.BAD_REQUEST_400)

        const res2 = await req
            .get(SETTINGS.PATH.POSTS)
            .expect(SETTINGS.HTTP_STATUSES.OK_200)
        expect(res2.body.items).toEqual([])
    })

    it('shouldn\'t create post with incorrect input name', async () => {
        //создаем новый блог
        const newBlog = createNewBlog
        const res = await createNewEntity(newBlog, SETTINGS.PATH.BLOGS)
        const newPost: CreatePostModel = {
            title: '     ', //incorrect input name
            shortDescription: 'shortDescription' + Date.now() + Math.random(),
            content: 'content' + Date.now() + Math.random(),
            blogId: res.body.id,
        }
        const res1 = await req
            .post(SETTINGS.PATH.POSTS)
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .send(newPost) // отправка данных
            .expect(SETTINGS.HTTP_STATUSES.BAD_REQUEST_400)

        const res2 = await req
            .get(SETTINGS.PATH.POSTS)
            .expect(SETTINGS.HTTP_STATUSES.OK_200)
        expect(res2.body.items).toEqual([])
    })

    //не должен обновить пост с некорректными входными данными 
    it(`shouldn't update post with incorrect input data`, async () => {
        //создаем новый блог
        const newBlog = createNewBlog
        const res = await createNewEntity(newBlog, SETTINGS.PATH.BLOGS)
        //создаем новый пост
        const newPost = createNewPost(res.body.id)
        const res1 = await createNewEntity(newPost, SETTINGS.PATH.POSTS)

        const updatePost: UpdatePostModel = {
            title: 'title1',
            shortDescription: '   ', //incorrect input shortDescription
            content: 'content' + Date.now() + Math.random(),
            blogId: res.body.id,
        }

        await req
            .put(SETTINGS.PATH.POSTS + '/' + res1.body.id)
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .send(updatePost)
            .expect(SETTINGS.HTTP_STATUSES.BAD_REQUEST_400)
        //проверим, что действительно не обновился пост
        const res2 = await req
            .get(SETTINGS.PATH.POSTS + '/' + res1.body.id)
            .expect(SETTINGS.HTTP_STATUSES.OK_200, res1.body)
        expect(res2.body).toEqual(res1.body)
    })

    //не должен обновить с некорректным входным title 
    it(`shouldn't update post with incorrect input data`, async () => {
        //создаем новый блог
        const newBlog = createNewBlog
        const res = await createNewEntity(newBlog, SETTINGS.PATH.BLOGS)
        //создаем новый пост
        const newPost = createNewPost(res.body.id)
        const res1 = await createNewEntity(newPost, SETTINGS.PATH.POSTS)

        const updatePost: UpdatePostModel = {
            title: '       ', //incorrect input title
            shortDescription: 'shortDescription' + Date.now() + Math.random(),
            content: 'content' + Date.now() + Math.random(),
            blogId: res.body.id,
        }

        await req
            .put(SETTINGS.PATH.POSTS + '/' + res1.body.id)
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .send(updatePost)
            .expect(SETTINGS.HTTP_STATUSES.BAD_REQUEST_400)
        //проверим, что действительно не обновился пост
        const res2 = await req
            .get(SETTINGS.PATH.POSTS + '/' + res1.body.id)
            .expect(SETTINGS.HTTP_STATUSES.OK_200, res1.body)
        expect(res2.body).toEqual(res1.body)
    })

    //не должен обновиться блог, которого нет
    it(`shouldn't update post that not exist`, async () => {
        //создаем новый блог
        const newBlog = createNewBlog
        const res = await createNewEntity(newBlog, SETTINGS.PATH.BLOGS)
        //создаем новый пост
        const newPost = createNewPost(res.body.id)
        const res1 = await createNewEntity(newPost, SETTINGS.PATH.POSTS)

        const updatePost: UpdatePostModel = {
            title: 'title1',
            shortDescription: 'shortDescription' + Date.now() + Math.random(),
            content: 'content' + Date.now() + Math.random(),
            blogId: res.body.id,
        }

        await req
            .put(SETTINGS.PATH.POSTS + '/' + (new ObjectId()).toString())
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .send(updatePost)
            .expect(SETTINGS.HTTP_STATUSES.NOT_FOUND_404)
    })

    //должен обновиться пост с корректными входными данными
    it(`should update post with correct input data`, async () => {
        //создаем новый блог
        const newBlog = createNewBlog
        const res = await createNewEntity(newBlog, SETTINGS.PATH.BLOGS)
        //создаем новый пост
        const newPost = createNewPost(res.body.id)
        const res1 = await createNewEntity(newPost, SETTINGS.PATH.POSTS)

        const updatePost: UpdatePostModel = {
            title: 'title1',
            shortDescription: 'sh1',
            content: 'c1' + Date.now() + Math.random(),
            blogId: res.body.id,
        }

        const res2 = await req
            .put(SETTINGS.PATH.POSTS + '/' + res1.body.id)
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .send(updatePost)
            .expect(SETTINGS.HTTP_STATUSES.N0_CONTENT_204)
        //проверим, что действительно обновился пост
        const res3 = await req
            .get(SETTINGS.PATH.POSTS + '/' + res1.body.id)
            .expect(SETTINGS.HTTP_STATUSES.OK_200, {
                ...res1.body,
                title: updatePost.title,
                shortDescription: updatePost.shortDescription,
                content: updatePost.content
            })
    })

    //удаление поста и возвращение пустого массива
    it(`should delete post and return empty array`, async () => {
        //создаем новый блог
        const newBlog = createNewBlog
        const res = await createNewEntity(newBlog, SETTINGS.PATH.BLOGS)
        //создаем новый пост
        const newPost = createNewPost(res.body.id)
        const res1 = await createNewEntity(newPost, SETTINGS.PATH.POSTS)

        //проверили, что пост есть в базе данных
        const res2 = await req
            .get(SETTINGS.PATH.POSTS)
            .expect(SETTINGS.HTTP_STATUSES.OK_200)
        expect(res2.body.items).toEqual([res1.body])
        //удалим его
        await req
            .delete(SETTINGS.PATH.POSTS + '/' + res1.body.id)
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .expect(SETTINGS.HTTP_STATUSES.N0_CONTENT_204)
        //проверим, что действительно удалился
        const res3 = await req
            .get(SETTINGS.PATH.POSTS)
            .expect(SETTINGS.HTTP_STATUSES.OK_200)
        expect(res3.body.items).toEqual([])
    })

    //не должен удалить несуществующий пост
    it(`shouldn't delete post that not exist`, async () => {
        //создаем новый блог
        const newBlog = createNewBlog
        const res = await createNewEntity(newBlog, SETTINGS.PATH.BLOGS)
        //создаем новый пост
        const newPost = createNewPost(res.body.id)
        const res1 = await createNewEntity(newPost, SETTINGS.PATH.POSTS)

        //проверили, что пост есть в базе данных
        const res2 = await req
            .get(SETTINGS.PATH.POSTS)
            .expect(SETTINGS.HTTP_STATUSES.OK_200)
        expect(res2.body.items).toEqual([res1.body])

        await req
            .delete(SETTINGS.PATH.POSTS + '/' + (new ObjectId()).toString())
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS })
            .expect(SETTINGS.HTTP_STATUSES.NOT_FOUND_404)
        //проверим, что ничего не удалилось
        await req
            .get(SETTINGS.PATH.POSTS + '/' + res1.body.id)
            .expect(SETTINGS.HTTP_STATUSES.OK_200, res1.body)
    })

    //проверим неправильную авторизацию при удалении поста
    it(`shouldn't delete post without autorization`, async () => {
        //создаем новый блог
        const newBlog = createNewBlog
        const res = await createNewEntity(newBlog, SETTINGS.PATH.BLOGS)
        //создаем новый пост
        const newPost = createNewPost(res.body.id)
        const res1 = await createNewEntity(newPost, SETTINGS.PATH.POSTS)

        //проверили, что пост есть в базе данных
        const res2 = await req
            .get(SETTINGS.PATH.POSTS)
            .expect(SETTINGS.HTTP_STATUSES.OK_200)
        expect(res2.body.items).toEqual([res1.body])

        await req
            .delete(SETTINGS.PATH.POSTS + '/' + res1.body.id)
            .set({ 'authorization': 'Basic ' + SETTINGS.ADMIN_AUTH_FOR_TESTS + 'test' })
            .expect(SETTINGS.HTTP_STATUSES.UNAUTHORIZED_401)
        //проверим, что ничего не удалилось
        await req
            .get(SETTINGS.PATH.POSTS + '/' + res1.body.id)
            .expect(SETTINGS.HTTP_STATUSES.OK_200)
        expect(res2.body.items).toEqual([res1.body])
    })
})

