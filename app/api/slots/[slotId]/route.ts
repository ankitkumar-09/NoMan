import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

/**
 * HELPER: Admin Authorization
 */
function isAuthorized(req: NextRequest) {
    return req.headers.get("x-admin-secret") === process.env.ADMIN_SECRET
}

/**
 * HELPER: Send Email via Brevo
 */
async function sendSlotEmail(
    email: string,
    name: string,
    slotTitle: string,
    slotDate: string,
    slotTime: string,
    slotDuration: string,
    meetingLink: string
) {
    if (process.env.SEND_SLOT_EMAIL !== "true") return

    const BREVO_API_KEY = process.env.BREVO_API_KEY
    if (!BREVO_API_KEY) {
        console.error("❌ BREVO_API_KEY missing")
        return
    }

    const currentYear = new Date().getFullYear()
    const formattedDate = new Date(slotDate + "T00:00:00").toLocaleDateString(
        "en-US",
        { year: "numeric", month: "long", day: "numeric" }
    )

    try {
        const res = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": BREVO_API_KEY,
            },
            body: JSON.stringify({
                sender: {
                    name: "NoMan Studios",
                    email: "studios@nomangames.store",
                },
                to: [{ email, name }],
                subject: `📅 Interview Slot Confirmed — ${slotTitle}`,
                htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Slot Confirmed</title>
</head>
<body style="margin:0;padding:0;background-color:#050505;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#050505;padding:60px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:500px;background-color:#0f0f0f;border:1px solid #262626;border-radius:2px;overflow:hidden;">
          <tr>
            <td align="center" style="padding:50px 0 20px;">
              <img src="https://res.cloudinary.com/dpnpmkhmb/image/upload/v1773735174/1_knbqwl.png" alt="NoMan Studios" width="56" height="56" style="display:block;border-radius:4px;border:1px solid #333333;" />
              <div style="height:1px;width:30px;background-color:#ea580c;margin-top:20px;"></div>
            </td>
          </tr>
          <tr>
            <td style="padding:0 45px 40px;text-align:center;">
              <h1 style="color:#ffffff;font-size:22px;font-weight:900;margin:0 0 8px;letter-spacing:2px;text-transform:uppercase;">Slot Confirmed</h1>
              <p style="color:#ea580c;font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 30px;">${slotTitle}</p>
              <p style="color:#888888;font-size:14px;line-height:1.8;margin:0 0 24px;">Hi <span style="color:#ffffff;font-weight:700;">${name}</span>,</p>
              <p style="color:#888888;font-size:14px;line-height:1.8;margin:0 0 30px;">Your interview slot has been successfully booked. Details below:</p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#1a1a1a;border:1px solid #2a2a2a;border-radius:4px;margin-bottom:30px;">
                <tr>
                  <td style="padding:24px 28px; text-align:left;">
                    <div style="margin-bottom:10px;"><span style="color:#555;font-size:11px;text-transform:uppercase;">Role</span><br/><span style="color:#fff;">${slotTitle}</span></div>
                    <div style="margin-bottom:10px;"><span style="color:#555;font-size:11px;text-transform:uppercase;">Date</span><br/><span style="color:#fff;">${formattedDate}</span></div>
                    <div style="margin-bottom:10px;"><span style="color:#555;font-size:11px;text-transform:uppercase;">Time</span><br/><span style="color:#fff;">${slotTime}</span></div>
                    <div><span style="color:#555;font-size:11px;text-transform:uppercase;">Duration</span><br/><span style="color:#fff;">${slotDuration}</span></div>
                    ${meetingLink ? `
<div style="margin-top:10px; padding-top:10px; border-top:1px solid #2a2a2a;">
  <span style="color:#555;font-size:11px;text-transform:uppercase;">Meeting Link</span><br/>
  <a href="${meetingLink}" style="color:#ea580c; font-size:13px; font-weight:bold; text-decoration:none;">
    Click here to join the interview →
  </a>
</div>` : ""}
                  </td>
                </tr>
              </table>
              <p style="color:#666;font-size:13px;">Instructions will be shared shortly before the time.</p>
              <table align="center" style="margin-top:20px;">
                <tr>
                  <td style="background-color:#ea580c;border-radius:2px;">
                    <a href="https://www.nomangames.store" style="color:#fff;text-decoration:none;padding:12px 30px;display:inline-block;font-size:12px;font-weight:bold;text-transform:uppercase;">Visit Site</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color:#0a0a0a;padding:20px;text-align:center;border-top:1px solid #222;">
              <p style="color:#444;font-size:10px;">&copy; ${currentYear} NOMAN STUDIOS</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
            }),
        })

        if (!res.ok) {
            console.error("❌ Brevo error:", await res.text())
        } else {
            console.log("✅ Slot email sent to", email)
        }
    } catch (err) {
        console.error("❌ Email fetch failed:", err)
    }
}

/**
 * GET — Get Single Slot
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slotId: string }> }
) {
    try {
        const { slotId } = await params
        const client = await clientPromise
        const db = client.db("noman")

        const slot = await db
            .collection("slots")
            .findOne({ _id: new ObjectId(slotId) })

        if (!slot) {
            return NextResponse.json({ error: "Slot not found" }, { status: 404 })
        }

        return NextResponse.json({ slot }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

/**
 * PATCH — Book or Unbook Slot
 */
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ slotId: string }> }
) {
    try {
        const { slotId } = await params
        const client = await clientPromise
        const db = client.db("noman")

        // Find the slot first
        const slot = await db
            .collection("slots")
            .findOne({ _id: new ObjectId(slotId) })

        if (!slot) {
            return NextResponse.json({ error: "Slot not found" }, { status: 404 })
        }

        const body = await req.json()

        // 1. ADMIN UNBOOK LOGIC
        if (body.action === "unbook") {
            if (!isAuthorized(req)) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
            }
            await db.collection("slots").updateOne(
                { _id: new ObjectId(slotId) },
                { $set: { isBooked: false, bookedBy: null } }
            )
            return NextResponse.json({ success: true }, { status: 200 })
        }

        // 2. PUBLIC BOOKING LOGIC
        if (slot.isBooked) {
            return NextResponse.json({ error: "Already booked" }, { status: 409 })
        }

        const { name, email } = body
        if (!name || !email) {
            return NextResponse.json({ error: "Name/Email required" }, { status: 400 })
        }

        // Check if user already has a booking
        const existing = await db.collection("slots").findOne({ "bookedBy.email": email })
        if (existing) {
            return NextResponse.json({ error: "You already have a booking" }, { status: 409 })
        }

        // Update the slot
        await db.collection("slots").updateOne(
            { _id: new ObjectId(slotId) },
            {
                $set: {
                    isBooked: true,
                    bookedBy: { name, email, bookedAt: new Date() },
                },
            }
        )

        // Trigger email
        await sendSlotEmail(email, name, slot.title, slot.date, slot.time, slot.duration, slot.link || "")
        return NextResponse.json({ success: true }, { status: 200 })
    } catch (err) {
        console.error("PATCH error:", err)
        return NextResponse.json({ error: "Failed to book" }, { status: 500 })
    }
}

/**
 * DELETE — Remove Slot (Admin)
 */
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ slotId: string }> }
) {
    try {
        const { slotId } = await params
        if (!isAuthorized(req)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const client = await clientPromise
        const db = client.db("noman")

        await db.collection("slots").deleteOne({ _id: new ObjectId(slotId) })
        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
    }
}