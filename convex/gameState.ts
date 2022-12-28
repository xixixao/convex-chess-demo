import { findGame } from '../server/findGame'
import { Position } from '../shared/GameState'
import { query } from './_generated/server'

export default query(async ({ db }, code: string, playerID: string) => {
  const game = await findGame(db, code)
  if (game == null) {
    throw new Error('Game not found')
  }
  const players = game.players ?? new Map()
  const player = players.get(playerID)
  if (player == null) {
    throw new Error('Player not found')
  }
  const otherPlayer = [...players.values()].find((p) => p.side !== player.side)
  return {
    viewer: {
      name: player.name,
      side: player.side as 'white' | 'black',
    },
    otherPlayer:
      otherPlayer != null
        ? {
            name: otherPlayer.name,
            side: otherPlayer.side as 'white' | 'black',
          }
        : null,

    currentSide: game.currentSide as 'white' | 'black',

    moves: game.moves as Array<[Position, Position]>,
    outcome: 'playing',
  }
})
