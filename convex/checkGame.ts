import { findGame } from '../server/findGame'
import { mutation } from './_generated/server'

export default mutation(async ({ db }, code: string) => {
  const game = await findGame(db, code)
  if (game == null) {
    throw new Error('Game not found')
  }
  return true
})
