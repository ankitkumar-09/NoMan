import { NextRequest, NextResponse } from "next/server"
import getMongoClient from "@/lib/mongodb"

// POST — verify token, increment visit count, return applicant data
export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      )
    }

    const client = await getMongoClient()
    const db = client.db("noman")

    // Find invite by token
    const invite = await db.collection("invites").findOne({ token })

    if (!invite) {
      return NextResponse.json(
        { error: "Invalid or expired link. Please contact NoMan Studios." },
        { status: 404 }
      )
    }

    // Check if already expired
    if (invite.isExpired) {
      return NextResponse.json(
        {
          error:
            "This link has expired. You have already used your maximum allowed visits.",
          expired: true,
        },
        { status: 410 }
      )
    }

    // Check if candidate already booked a slot
    const existingBooking = await db.collection("slots").findOne({
      "bookedBy.email": invite.email,
    })

    // Increment visit count
    const newVisits = invite.visits + 1
    const willExpire = newVisits >= invite.maxVisits

    await db.collection("invites").updateOne(
      { token },
      {
        $set: {
          visits: newVisits,
          isExpired: willExpire,
          lastVisitAt: new Date(),
        },
      }
    )

    return NextResponse.json(
      {
        valid: true,
        name: invite.name,
        email: invite.email,
        jobTitle: invite.jobTitle,
        visitsRemaining: Math.max(0, invite.maxVisits - newVisits),
        willExpireNext: newVisits === invite.maxVisits - 1,
        alreadyBooked: !!existingBooking,
        bookedSlot: existingBooking
          ? {
              title: existingBooking.title,
              date: existingBooking.date,
              time: existingBooking.time,
              duration: existingBooking.duration,
            }
          : null,
      },
      { status: 200 }
    )
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Failed to verify token" },
      { status: 500 }
    )
  }
}

