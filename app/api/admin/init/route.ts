import { NextRequest, NextResponse } from "next/server"
import getMongoClient from "@/lib/mongodb"

export async function GET(req: NextRequest) {
  if (req.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const client = await getMongoClient()
  const db = client.db("noman")

  const [jobs, applications] = await Promise.all([
    db.collection("jobs").find({}).toArray(),
    db.collection("applications").find({}).sort({ createdAt: -1 }).toArray(),
  ])

  return NextResponse.json({ jobs, applications })
}