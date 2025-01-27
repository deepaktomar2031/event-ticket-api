export enum STATUS_CODES {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,

  MOVED = 301,
  FOUND = 302,

  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  PROXY_AUTHENTICATION_REQUIRED = 407,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  TOO_MANY_REQUESTS = 429,

  SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

export const APPLICATION_ERRORS = {
  // Client Errors
  BAD_REQUEST: {
    message: 'Bad request. See Application logs for details.',
    statusCode: STATUS_CODES.BAD_REQUEST,
  },
  UNAUTHORIZED: {
    message: 'Unauthorized. See Application logs for details.',
    statusCode: STATUS_CODES.UNAUTHORIZED,
  },
  FORBIDDEN: {
    message: 'Forbidden. See Application logs for details.',
    statusCode: STATUS_CODES.FORBIDDEN,
  },
  NOT_FOUND: {
    message: 'Not Found. See Application logs for details.',
    statusCode: STATUS_CODES.NOT_FOUND,
  },
  METHOD_NOT_ALLOWED: {
    message: 'Method Not Allowed. See Application logs for details.',
    statusCode: STATUS_CODES.METHOD_NOT_ALLOWED,
  },
  NOT_ACCEPTABLE: {
    message: 'Not Acceptable. See Application logs for details.',
    statusCode: STATUS_CODES.NOT_ACCEPTABLE,
  },
  PROXY_AUTHENTICATION_REQUIRED: {
    message: 'Proxy Authentication Required. See Application logs for details.',
    statusCode: STATUS_CODES.PROXY_AUTHENTICATION_REQUIRED,
  },
  REQUEST_TIMEOUT: {
    message: 'Request Timeout. See Application logs for details.',
    statusCode: STATUS_CODES.REQUEST_TIMEOUT,
  },
  TOO_MANY_REQUESTS: {
    message: 'Too Many Requests. See Application logs for details.',
    statusCode: STATUS_CODES.TOO_MANY_REQUESTS,
  },

  // Server Errors
  SERVER_ERROR: {
    message: 'Internal Server Error. See Application logs for details.',
    statusCode: STATUS_CODES.SERVER_ERROR,
  },
  NOT_IMPLEMENTED: {
    message: 'Not Implemented. See Application logs for details.',
    statusCode: STATUS_CODES.NOT_IMPLEMENTED,
  },
  SERVICE_UNAVAILABLE: {
    message: 'Service Unavailable. See Application logs for details.',
    statusCode: STATUS_CODES.SERVICE_UNAVAILABLE,
  },
  GATEWAY_TIMEOUT: {
    message: 'Gateway Timeout. See Application logs for details.',
    statusCode: STATUS_CODES.GATEWAY_TIMEOUT,
  },
}
