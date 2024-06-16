import { UserViewModel } from "./UserViewModel";

export type UsersViewModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number;
    items: UserViewModel[]
}