import { DatabaseReader } from '../convex/_generated/server'

export async function findGame(db: DatabaseReader, code: string) {
  return await db
    .query('games')
    .filter((q) => q.eq(q.field('code'), code.toLowerCase()))
    .first()
}
