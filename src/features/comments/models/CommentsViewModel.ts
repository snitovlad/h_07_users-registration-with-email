import { CommentViewModel } from "./CommentViewModel";

export type CommentsViewModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number;
    items: CommentViewModel[]
}