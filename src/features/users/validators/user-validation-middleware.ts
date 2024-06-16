import { body } from "express-validator";

export const inputLoginUserValidator = () => body('login')
    .exists().withMessage('Error!! Field is not exist')
    .isString().withMessage('Error!! Field should be string')
    .trim().notEmpty().withMessage('Error!! Field shouldn\'t be empty')
    .isLength({ min: 3, max: 10 }).withMessage('Error!! Invalid field length')
    .matches(/^[a-zA-Z0-9_-]*$/).withMessage('Error!! Field should only contain letters, numbers, underscores, or hyphens');

export const inputPasswordUserValidator = () => body('password')
    .exists().withMessage('Error!! Field is not exist')
    .isString().withMessage('Error!! Field should be string')
    .trim().notEmpty().withMessage('Error!! Field shouldn\'t be empty')
    .isLength({ min: 6, max: 20 }).withMessage('Error!! Invalid field length')

export const inputEmailUserBlogValidator = () => body('email')
    .exists().withMessage('Error!! Field is not exist')
    .isString().withMessage('Error!! Field should be string')
    .trim().notEmpty().withMessage('Error!! Field shouldn\'t be empty')
    .isLength({ min: 1, max: 100 }).withMessage('Error!! Invalid field length')
    .isEmail().withMessage('Error!! Field filled in incorrectly')







