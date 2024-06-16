import { body } from "express-validator";

export const inputContentCommentValidator = () => body('content')
    .exists().withMessage('Error!! Field is not exist')
    .isString().withMessage('Error!! Field should be string')
    .trim().notEmpty().withMessage('Error!! Field shouldn\'t be empty')
    .isLength({ min: 20, max: 300 }).withMessage('Error!! Invalid field length')