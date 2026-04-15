import { NextRequest, NextResponse } from "next/server"
import getMongoClient from "@/lib/mongodb"
import { ObjectId } from "mongodb"

function isAuthorized(req: NextRequest) {
  return req.headers.get("x-admin-secret") === process.env.ADMIN_SECRET
}

// GET — fetch all applications, optional ?jobId= filter
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const jobId = searchParams.get("jobId")
    const status = searchParams.get("status")

    const query: Record<string, string> = {}
    if (jobId) query.jobId = jobId
    if (status) query.status = status

    const client = await getMongoClient()
    const db = client.db("noman")

    const applications = await db
      .collection("applications")
      .find(query)
      .sort({ appliedAt: -1 })
      .toArray()

    return NextResponse.json({ applications }, { status: 200 })
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    )
  }
}

// PATCH — update application status
export async function PATCH(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { applicationId, status } = await req.json()

    const validStatuses = ["pending", "reviewing", "accepted", "rejected"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const client = await getMongoClient()
    const db = client.db("noman")

    await db.collection("applications").updateOne(
      { _id: new ObjectId(applicationId) },
      { $set: { status } }
    )

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    )
  }
}

// DELETE — remove an application
export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { applicationId } = await req.json()

    const client = await getMongoClient()
    const db = client.db("noman")

    await db
      .collection("applications")
      .deleteOne({ _id: new ObjectId(applicationId) })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete application" },
      { status: 500 }
    )
  }
}

