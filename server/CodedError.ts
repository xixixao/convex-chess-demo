const token = '__CODED__'
export class CodedError extends Error {
  constructor(message: string) {
    super(token + message + token)
  }

  static decode(error: string) {
    const start = error.indexOf(token)
    const end = error.lastIndexOf(token)
    if (start === -1 || end === -1) {
      return null
    }
    return error.substring(start + token.length, end)
  }
}
