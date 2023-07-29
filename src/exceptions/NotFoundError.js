const ClientError = require('./ClientError')

class NotFoundError extends ClientError {
  constructor (message, statusCode = 400) {
    super(message, 404)
    this.statusCode = statusCode
    this.name = 'NotFoundError'
  }
}

module.exports = NotFoundError
