// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config()
import express, { Express } from 'express'
import { routes } from '@src/routes/routes'
import { connectRedis } from '@src/services'
import { ExtendedError } from '@src/utils'
import { connectToDatabase } from './../../knexfile'
import { PORT, APPLICATION_ERRORS } from '@src/constant'

export const app: Express = express()

const listenPort = (PORT: number) => {
  app.listen(PORT, () => console.log(`Server is up & running on http://localhost:${PORT}`))
}

const userBodyParser = () => {
  app.use(express.json())
}

const createRoutes = async () => {
  routes(app)
}

const start = async () => {
  try {
    await listenPort(PORT)
    userBodyParser()
    await connectToDatabase()
    await createRoutes()
    await connectRedis()
  } catch (error) {
    console.error(`error: ${error}`)

    throw new ExtendedError({ ...APPLICATION_ERRORS.SERVER_ERROR })
  }
}

export default { start }
