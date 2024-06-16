import { SortDirection } from "mongodb"

export type UsersQueryModel = {
    sortBy?: string
    sortDirection?: SortDirection
    pageNumber?: number
    pageSize?: number
    searchLoginTerm?: string | null
    searchEmailTerm?: string | null
}