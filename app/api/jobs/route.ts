import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { Job } from "@/lib/types"

// GET — fetch all open jobs (public)
// app/api/jobs/route.ts

export async function GET(req: NextRequest) {
  try {
    const adminSecret = req.headers.get("x-admin-secret")
    const isAdmin = adminSecret === process.env.ADMIN_SECRET

    const client = await clientPromise
    const db = client.db("noman")
    
    // If not admin, only show open jobs. 
    // If admin, show everything.
    const query = isAdmin ? {} : { isOpen: true }

    const jobs = await db
      .collection("jobs")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray()

    // If the user TRIED to send a secret but it was wrong, return 401
    // This makes your frontend login button fail correctly
    if (adminSecret && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ jobs }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}

// POST — create new job (admin only)
export async function POST(req: NextRequest) {
  try {
    const adminSecret = req.headers.get("x-admin-secret")
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    const job: Job = {
      ...body,
      isOpen: true,
      createdAt: new Date(),
    }

    const client = await clientPromise
    const db = client.db("noman")
    const result = await db.collection("jobs").insertOne(job)

    return NextResponse.json({ id: result.insertedId }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 })
  }
}
