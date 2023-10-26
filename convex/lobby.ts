import { CodedError } from '../server/CodedError'
import { findGame } from '../server/findGame'
import { query } from './_generated/server'

export const state = query(async ({ db }, { code }: { code: string }) => {
  const game = await findGame(db, code)
  if (game == null) {
    throw new CodedError('Game not found')
  }
  const players = game.players ?? new Map()
  return {
    numPlayersJoined: players.length,
  }
})
