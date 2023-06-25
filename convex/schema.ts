import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  games: defineTable({
    code: v.string(),
    players: v.map(
      v.string(),
      v.object({
        side: v.string(),
        name: v.string(),
      }),
    ),
    currentSide: v.string(),
    moves: v.array(v.array(v.array(v.number()))),
  }),
})
