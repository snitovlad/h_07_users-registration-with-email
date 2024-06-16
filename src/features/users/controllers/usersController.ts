import { ErrorMessage, Result } from '../../../common/types/result.type';
import { URIParamsUserIdModel } from '../users-model/URIParamsUserIdModel';
import { Response } from "express"
//import { RequestWithBody, RequestWithParams, RequestWithQuery } from "../../../models/requestTypes"
import { queryDefaulUsersValues } from "../../../helper/queryDefaultValues"
import { UsersQueryModel } from "../users-model/UsersQueryModel"
import { UsersViewModel } from "../users-model/UsersViewModel"
import { CreateUserModel } from "../users-model/CreateUseerModel"
import { UserViewModel } from "../users-model/UserViewModel"
import { usersService } from "../services/users-service"
import { SETTINGS } from '../../../settings';
import { ResultStatus } from '../../../common/types/resultCode';
import { usersQueryRepository } from '../repository/users-query-repository';
import { ErrorsViewModel } from '../../../common/types/ErrorsViewModel';
import { RequestWithBody, RequestWithParams, RequestWithQuery } from '../../../common/types/requestTypes';

export const usersController = {

    async findAllUsers(
        req: RequestWithQuery<UsersQueryModel>, res: Response<UsersViewModel | { error: string }>) {
        const sanitizedQuery = queryDefaulUsersValues(req.query)

        const allUsers = await usersQueryRepository.findAllUsers(sanitizedQuery)
        res
            .status(SETTINGS.HTTP_STATUSES.OK_200)
            .json(allUsers)
    },

    async createUser(
        req: RequestWithBody<CreateUserModel>,
        res: Response<UserViewModel | null | ErrorsViewModel | ErrorMessage>) {

        //здесь createdInfo = {status, errorMessage?, data?}
        const createdInfo: Result<string> = await usersService.createUser(req.body.login, req.body.password, req.body.email)
        if (createdInfo.status !== ResultStatus.Success) {
            res
                .status(SETTINGS.HTTP_STATUSES.BAD_REQUEST_400)
                .json(createdInfo.errorMessage)
            return
        }
        if (createdInfo.data) { //if - т.к. id?
            const newUser = await usersQueryRepository.findUser(createdInfo.data)
            res
                .status(SETTINGS.HTTP_STATUSES.CREATED_201)
                .json(newUser)
        }
    },

    async deleteUser(req: RequestWithParams<URIParamsUserIdModel>, res: Response) {

        const isDelete = await usersService.deleteUser(req.params.id)
        if (isDelete) {
            res.sendStatus(SETTINGS.HTTP_STATUSES.N0_CONTENT_204)
        }
        else {
            res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND_404)
        }
    }
}
