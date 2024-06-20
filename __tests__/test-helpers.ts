import { app } from '../src/app';
import { agent } from 'supertest'   //позволяет сохранять состояние между запросами

// import request from "supertest"  //создаёт новый агент для каждого запроса.
//agent будет следить за нашим backend, и через него будем делать какие-то запросы
//вспомогательную/повторяющуюся логику можно складывать в отдельные файлы:

export const req = agent(app) //обозвали req (с помощью него будем делать запросы на backend)

// const getRequest = () => {
//     return request(app)
// }