import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  games: defineTable({
    code: v.string(),
    players: v.array(
      v.object({
        id: v.string(),
        side: v.string(),
        name: v.string(),
      }),
    ),
    currentSide: v.string(),
    moves: v.array(v.array(v.array(v.number()))),
  }),
})
