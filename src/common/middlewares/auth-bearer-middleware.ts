import { NextFunction, Request, Response } from "express"
import { SETTINGS } from "../../settings"
import { jwtService } from "../adapters/jwt.service"


export const authBearerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(SETTINGS.HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }
    const token = req.headers.authorization.split(' ')[1]
    const userId = await jwtService.getUserIdByJWTToken(token)

    if (userId) {
        req.userId = userId
        next()
    } else {
        res.sendStatus(SETTINGS.HTTP_STATUSES.UNAUTHORIZED_401)
    }
}