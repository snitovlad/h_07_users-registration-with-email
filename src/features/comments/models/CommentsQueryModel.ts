import { SortDirection } from "mongodb"

export type CommentsQueryModel = {
    sortBy?: string
    sortDirection?: SortDirection
    pageNumber?: number
    pageSize?: number
}