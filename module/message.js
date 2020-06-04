class Message {
  constructor (_message) {
    this.message = _message
  }
}

// Status Code 200
class SuccessMessage extends Message {
  constructor (_data) {
    super('success')
    this.data = _data
  }
}

// Status Code 4XX
class FailedMessage extends Message {
  constructor (_err_code, _description) {
    super('failed')
    this.err_code = _err_code
    this.description = _description
  }
}

// Status Code 500
class InternalErrorMessage extends Message {
  constructor () {
    super('internal server error')
  }
}

module.exports = {
  Message,
  SuccessMessage,
  FailedMessage,
  InternalErrorMessage
}
