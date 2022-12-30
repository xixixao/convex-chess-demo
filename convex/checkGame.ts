import { CodedError } from '../server/CodedError'
import { findGame } from '../server/findGame'
import { mutation } from './_generated/server'

export default mutation(async ({ db }, code: string) => {
  const game = await findGame(db, code)
  if (game == null) {
    throw new CodedError('Game not found')
  }
  return true
})
