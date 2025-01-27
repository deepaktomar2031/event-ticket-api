import axios from 'axios'
import { Request, Response, NextFunction } from 'express'
import {
  STATUS_CODES,
  RECAPTCHA_SECRET_KEY,
  RECAPTCHA_URL,
  APPLICATION_ERRORS,
  NODE_ENV,
} from '@src/constant'
import { ExtendedError } from '@src/utils'

export const verifyCaptcha = async (req: Request, res: Response, next: NextFunction) => {
  if (NODE_ENV === 'development') return next()

  const { captchaToken } = req.body

  if (!captchaToken) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({ error: 'CAPTCHA verification required' })
  }

  try {
    const response = await axios.post(RECAPTCHA_URL, null, {
      params: {
        secret: RECAPTCHA_SECRET_KEY,
        response: captchaToken,
      },
    })

    const { success, score } = response.data

    if (!success || (score && score < 0.5)) {
      return res.status(STATUS_CODES.FORBIDDEN).json({ error: 'CAPTCHA verification failed' })
    }

    next()
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
