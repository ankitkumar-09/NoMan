import { NextRequest, NextResponse } from "next/server"
import getMongoClient from "@/lib/mongodb"

function isAuthorized(req: NextRequest) {
  return req.headers.get("x-admin-secret") === process.env.ADMIN_SECRET
}

// GET — all slots (public, sorted by date)
export async function GET() {
  try {
    const client = await getMongoClient()
    const db = client.db("noman")

    const slots = await db
      .collection("slots")
      .find({}, { 
        projection: { link: 0 } 
      })
      .sort({ date: 1, time: 1 })
      .toArray()

    return NextResponse.json({ slots }, { status: 200 })
  } catch {
    return NextResponse.json({ error: "Failed to fetch slots" }, { status: 500 })
  }
}

// POST — create new slot (admin only)
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { title, date, time, duration, link } = body

    // 2. THE FIX: Validate that ALL fields (including link) exist
    if (!title || !date || !time || !duration || !link) {
      return NextResponse.json(
        { error: "Missing required fields: Title, Date, Time, Duration, and Link are all required." }, 
        { status: 400 }
      )
    }

    const slot = {
      title,
      date,        // "YYYY-MM-DD"
      time,        // "HH:MM"
      duration,    // e.g. "30 min"
      link: link || "",
      isBooked: false,
      bookedBy: null,   // { name, email, bookedAt }
      createdAt: new Date(),
    }

    const client = await getMongoClient()
    const db = client.db("noman")
    const result = await db.collection("slots").insertOne(slot)

    return NextResponse.json({ id: result.insertedId }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create slot" }, { status: 500 })
  }
}

