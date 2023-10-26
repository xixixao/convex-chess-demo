import { CodedError } from '../server/CodedError'
import { findGame } from '../server/findGame'
import { Position } from '../shared/GameState'
import { mutation } from './_generated/server'
import { getPlayer } from './game'

export default mutation(
  async (
    { db },
    {
      code,
      playerID,
      move,
    }: { code: string; playerID: string; move: [Position, Position] },
  ) => {
    const game = await findGame(db, code)
    if (game == null) {
      throw new CodedError('Game not found')
    }
    const players = game.players ?? new Map()
    const player = getPlayer(players, playerID)
    if (player == null) {
      throw new CodedError('Player not found')
    }

    if (player.side !== game.currentSide) {
      throw new CodedError('It is not your turn')
    }

    await db.patch(game._id, {
      currentSide: game.currentSide === 'white' ? 'black' : 'white',
      moves: [...game.moves, move],
    })
  },
)
