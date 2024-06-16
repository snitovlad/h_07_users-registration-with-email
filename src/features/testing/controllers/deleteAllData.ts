import { Request, Response } from 'express'
import { deleteAllDataRepository } from '../repository/deleteAllData-repository'
import { SETTINGS } from '../../../settings'


export const deleteAllData = (req: Request, res: Response) => {

    try {
        deleteAllDataRepository.deleteAllData()
        res.sendStatus(SETTINGS.HTTP_STATUSES.N0_CONTENT_204)
    } catch (e) {
        res.sendStatus(SETTINGS.HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
    }
}
