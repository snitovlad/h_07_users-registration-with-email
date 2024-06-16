import { ResultStatus } from "./resultCode"

// export type Result<T = null> = {
//     status: ResultStatus
//     errorMessage?: string  //какое-то сообщение об ошибке
//     extensions?: [{ field: 'id', message: '' }]  //тоже про ошибку
//     data?: T  //поле заполняется, когда status: success
// }


export type Result<T = null> = {
    status: ResultStatus
    errorMessage?: ErrorMessage
    data?: T  //поле заполняется, когда status: success
}
export type ErrorMessage = {
    errorMessages: Array<{
        message: string;
        field: string;
    }>;
};

