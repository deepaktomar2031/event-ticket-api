import { Request, Response } from 'express'
import { ExtendedError, message } from '@src/utils'
import { STATUS_CODES, APPLICATION_ERRORS } from '@src/constant'

export const healthCheck = async (req: Request, res: Response) => {
  try {
    res
      .status(STATUS_CODES.OK)
      .json({ successful: true, message: message.Server_Is_Up_And_Running })
  } catch (error: unknown) {
    console.error(`error: ${error}`)

    if (error instanceof ExtendedError) {
      res.status(error.statusCode).send({ error: error.message })
    } else {
      const serverError = new ExtendedError({ ...APPLICATION_ERRORS.SERVER_ERROR })
      res.status(serverError.statusCode).send({ error: serverError.message })
    }
  }
}
