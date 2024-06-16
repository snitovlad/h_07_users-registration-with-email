import express from 'express';
import { deleteAllData } from '../features/testing/controllers/deleteAllData';

export const testingRouter = express.Router()

testingRouter.delete('/', deleteAllData)
