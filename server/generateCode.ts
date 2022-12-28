const CODE_LENGTH = 3

export function generateCode() {
  let code = ''
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += generateCodeChar()
  }
  return code
}

function generateCodeChar() {
  const chars = 'abcdefghjklmnpqrstuvwxyz'
  return chars[Math.floor(Math.random() * chars.length)]
}
