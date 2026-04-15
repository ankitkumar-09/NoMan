import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

// GET — top 10 scores
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("noman")

    const scores = await db
      .collection("leaderboard")
      .find({})
      .sort({ bestMoves: 1 }) // lower moves = better
      .limit(100)
      .toArray()

    return NextResponse.json({ scores }, { status: 200 })
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}

// POST — submit or update score
export async function POST(req: NextRequest) {
  try {
    const { playerId, name, moves } = await req.json()

    if (!playerId || !name || !moves) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("noman")

    // Update only if new score is better (lower moves)
    await db.collection("leaderboard").updateOne(
      { playerId },
      {
        $min: { bestMoves: moves },   // only updates if moves < existing
        $set: { name, updatedAt: new Date() },
        $setOnInsert: { playerId, createdAt: new Date() },
      },
      { upsert: true }
    )

    const player = await db.collection("leaderboard").findOne({ playerId })

    return NextResponse.json({ player }, { status: 200 })
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 })
  }
}