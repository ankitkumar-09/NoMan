// app/api/admin/email-template/route.ts
//
// GET  → returns the saved template (or 404 if none saved yet)
// POST → saves / updates the template in MongoDB

import { NextRequest, NextResponse } from "next/server"
import getMongoClient from "@/lib/mongodb"

const ADMIN_SECRET = process.env.ADMIN_SECRET

function isAuthed(req: NextRequest) {
  return req.headers.get("x-admin-secret") === ADMIN_SECRET
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const client = await getMongoClient()
    const db = client.db("noman")

    const doc = await db
      .collection("settings")
      .findOne({ key: "applicationEmailTemplate" })

    if (!doc) {
      // No template saved yet — front-end will fall back to its built-in default
      return NextResponse.json({ html: null, subject: null }, { status: 200 })
    }

    return NextResponse.json({ html: doc.html, subject: doc.subject }, { status: 200 })
  } catch (err) {
    console.error("email-template GET error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { html, subject } = await req.json()

    if (!html || typeof html !== "string") {
      return NextResponse.json({ error: "html is required" }, { status: 400 })
    }

    const client = await getMongoClient()
    const db = client.db("noman")

    await db.collection("settings").updateOne(
      { key: "applicationEmailTemplate" },
      {
        $set: {
          key: "applicationEmailTemplate",
          html,
          subject: subject || "🎮 Application Received — {{jobTitle}}",
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    )

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (err) {
    console.error("email-template POST error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}