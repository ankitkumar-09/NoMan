import { NextRequest, NextResponse } from "next/server"
import getMongoClient from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET — single job detail (public)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    // Correctly unwrap the promise-based params
    const { jobId } = await params

    if (!jobId || !ObjectId.isValid(jobId)) {
      return NextResponse.json({ error: "Invalid Job ID format" }, { status: 400 })
    }

    const client = await getMongoClient()
    const db = client.db("noman")

    const job = await db
      .collection("jobs")
      .findOne({ _id: new ObjectId(jobId) })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json({ job }, { status: 200 })
  } catch (err) {
    console.error("API GET Error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH — toggle isOpen (admin only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params
    const adminSecret = req.headers.get("x-admin-secret")

    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { isOpen } = await req.json()
    const client = await getMongoClient()
    const db = client.db("noman")

    await db.collection("jobs").updateOne(
      { _id: new ObjectId(jobId) },
      { $set: { isOpen } }
    )

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}

// DELETE — permanently delete a job (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params
    const adminSecret = req.headers.get("x-admin-secret")

    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await getMongoClient()
    const db = client.db("noman")

    await db.collection("jobs").deleteOne({ _id: new ObjectId(jobId) })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
