import { UsersSanitizedQueryModel } from "../features/users/users-model/UsersSanitizedQueryModel"
import { BlogsSanitizedQueryModel } from "../features/blogs/models/BlogsSanitizedQueryModel"
import { PostsSanitizedQueryModel } from "../features/posts/models/PostsSanitizedQueryModel"

// формирование ответа в нужном формате
export function commonResponseGeneration(filter: object,
    sanitizedQuery: BlogsSanitizedQueryModel | PostsSanitizedQueryModel | UsersSanitizedQueryModel,
    totalCount: number) {
    return {
        pagesCount: Math.ceil(totalCount / sanitizedQuery.pageSize),
        page: sanitizedQuery.pageNumber,
        pageSize: sanitizedQuery.pageSize,
        totalCount
        //items: items.map(mapToOutput)
    }
}
