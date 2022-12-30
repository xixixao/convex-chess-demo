import { findGame } from '../server/findGame'
import { Position } from '../shared/GameState'
import { mutation } from './_generated/server'

export default mutation(
  async (
    { db },
    code: string,
    playerID: string,
    move: [Position, Position],
  ) => {
    const game = await findGame(db, code)
    if (game == null) {
      throw new Error('Game not found')
    }
    const players = game.players ?? new Map()
    const player = players.get(playerID)
    if (player == null) {
      throw new Error('Player not found')
    }

    if (player.side !== game.currentSide) {
      throw new Error('It is not your turn')
    }

    await db.patch(game._id, {
      currentSide: game.currentSide === 'white' ? 'black' : 'white',
      moves: [...game.moves, move],
    })
  },
)
