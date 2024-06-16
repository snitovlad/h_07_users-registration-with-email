import { query } from 'express-validator';
import { SortDirection } from "mongodb"
import { BlogsQueryModel } from "../features/blogs/models/BlogsQueryModel"
import { PostsQueryModel } from "../features/posts/models/PostsQueryModel"
import { UsersQueryModel } from '../features/users/users-model/UsersQueryModel';
import { CommentsQueryModel } from '../features/comments/models/CommentsQueryModel';

export type QueryDefaultModel = {
    sortBy?: string
    sortDirection?: SortDirection
    pageNumber?: number
    pageSize?: number
}

export const queryDefaulValues = (query: QueryDefaultModel/*{[key: string]: number | undefined}*/) => {
    // варианты задания дефолтных значений
    return {
        sortBy: query.sortBy ? query.sortBy : 'createdAt',
        sortDirection: query.sortDirection ? query.sortDirection as SortDirection : 'desc',
        pageNumber: query.pageNumber ? +query.pageNumber : 1,
        pageSize: query.pageSize !== undefined ? +query.pageSize : 10,
    }
}

export const queryDefaulPostsValues = (query: PostsQueryModel/*{[key: string]: number | undefined}*/) => {
    return {
        ...queryDefaulValues(query)
    }
}

export const queryDefaulBlogsValues = (query: BlogsQueryModel/*{[key: string]: number | undefined}*/) => {
    return {
        searchNameTerm: query.searchNameTerm ? query.searchNameTerm : null,
        ...queryDefaulValues(query)
    }
}

export const queryDefaulUsersValues = (query: UsersQueryModel/*{[key: string]: number | undefined}*/) => {
    return {
        ...queryDefaulValues(query),
        searchLoginTerm: query.searchLoginTerm ? query.searchLoginTerm : null,
        searchEmailTerm: query.searchEmailTerm ? query.searchEmailTerm : null
    }
}

export const queryDefaultCommentsValues = (query: CommentsQueryModel/*{[key: string]: number | undefined}*/) => {
    return {
        ...queryDefaulValues(query)
    }
}