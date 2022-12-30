import { generateCode } from '../server/generateCode'
import { CODE_LENGTH } from '../shared/Code'
import { mutation } from './_generated/server'

export default mutation(async ({ db }) => {
  let code = null
  while (code == null) {
    const newCode = generateCode(CODE_LENGTH)
    const existing = await db
      .query('games')
      .filter((q) => q.eq(q.field('code'), newCode))
      .first()
    if (existing == null) {
      code = newCode
    }
  }

  await db.insert('games', {
    code,
    players: new Map(),
    currentSide: 'white',
    moves: [],
  })
  return code
})
