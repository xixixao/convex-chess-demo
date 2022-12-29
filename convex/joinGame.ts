import { findGame } from '../server/findGame'
import { generateCode } from '../server/generateCode'
import { Document } from './_generated/dataModel'
import { DatabaseWriter, mutation } from './_generated/server'

export default mutation(async ({ db }, code: string, name: string) => {
  const game = await findGame(db, code)
  if (game == null) {
    throw new Error('Game not found')
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
      throw new Error('The game is full')
  }
})

async function addPlayer(
  db: DatabaseWriter,
  game: Document<'games'>,
  players: Document<'games'>['players'],
  side: string,
  name: string
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
