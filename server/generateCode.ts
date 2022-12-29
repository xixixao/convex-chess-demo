export function generateCode(codeLength: number) {
  let code = ''
  for (let i = 0; i < codeLength; i++) {
    code += generateCodeChar()
  }
  return code
}

function generateCodeChar() {
  const chars = 'abcdefghjklmnpqrstuvwxyz'
  return chars[Math.floor(Math.random() * chars.length)]
}
