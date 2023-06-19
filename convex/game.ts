import { CodedError } from '../server/CodedError'
import { findGame } from '../server/findGame'
import { generateCode } from '../server/generateCode'
import { CODE_LENGTH } from '../shared/Code'
import { Position } from '../shared/GameState'
import { Doc } from './_generated/dataModel'
import { DatabaseWriter, mutation, query } from './_generated/server'

export const create = mutation(async ({ db }) => {
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

export const check = mutation(async ({ db }, { code }: { code: string }) => {
  const game = await findGame(db, code)
  if (game == null) {
    throw new CodedError('Game not found')
  }
  return true
})

export const state = query(
  async ({ db }, { code, playerID }: { code: string; playerID: string }) => {
    const game = await findGame(db, code)
    if (game == null) {
      throw new CodedError('Game not found')
    }
    const players = game.players ?? new Map()
    const player = players.get(playerID)
    if (player == null) {
      throw new CodedError('Player not found')
    }
    const otherPlayer = [...players.values()].find(
      (p) => p.side !== player.side,
    )
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
  },
)

export const join = mutation(
  async ({ db }, { code, name }: { code: string; name: string }) => {
    const game = await findGame(db, code)
    if (game == null) {
      throw new CodedError('Game not found')
    }

    const players = game.players ?? new Map()
    const playerCount = players.size
    switch (playerCount) {
      case 0: {
        return await addPlayer(db, game, players, 'white', name)
      }
      case 1: {
        return await addPlayer(db, game, players, 'black', name)
      }
      default:
        throw new CodedError('The game is full')
    }
  },
)

async function addPlayer(
  db: DatabaseWriter,
  game: Doc<'games'>,
  players: Doc<'games'>['players'],
  side: string,
  name: string,
) {
  let playerID = generatePlayerID()
  while (players.has(playerID)) {
    playerID = generatePlayerID()
  }
  players.set(playerID, { side, name })
  await db.patch(game._id, { players })
  return playerID
}

const PLAYER_ID_LENGTH = 10

function generatePlayerID() {
  return generateCode(PLAYER_ID_LENGTH)
}
