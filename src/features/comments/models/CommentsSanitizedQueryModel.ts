import { SortDirection } from "mongodb"

export type CommentsSanitizedQueryModel = {
    sortBy: string
    sortDirection: SortDirection
    pageNumber: number
    pageSize: number
}