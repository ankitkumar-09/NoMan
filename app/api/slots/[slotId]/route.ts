import { NextRequest, NextResponse } from "next/server"
import getMongoClient from "@/lib/mongodb"
import { ObjectId } from "mongodb"

function isAuthorized(req: NextRequest) {
  return req.headers.get("x-admin-secret") === process.env.ADMIN_SECRET
}

async function sendSlotEmail(
  email: string,
  name: string,
  slotTitle: string,
  slotDate: string,
  slotTime: string,
  slotDuration: string,
  slotNote: string
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
              <p style="color:#888888;font-size:14px;line-height:1.8;margin:0 0 24px;">
                Hi <span style="color:#ffffff;font-weight:700;">${name}</span>,
              </p>
              <p style="color:#888888;font-size:14px;line-height:1.8;margin:0 0 30px;">
                Your interview slot has been successfully booked. Here are your slot details:
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#1a1a1a;border:1px solid #2a2a2a;border-radius:4px;margin-bottom:30px;">
                <tr>
                  <td style="padding:24px 28px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #222222;">
                          <span style="color:#555555;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Role</span><br/>
                          <span style="color:#ffffff;font-size:14px;font-weight:600;">${slotTitle}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #222222;">
                          <span style="color:#555555;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Date</span><br/>
                          <span style="color:#ffffff;font-size:14px;font-weight:600;">${formattedDate}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #222222;">
                          <span style="color:#555555;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Time</span><br/>
                          <span style="color:#ffffff;font-size:14px;font-weight:600;">${slotTime}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;${slotNote ? "border-bottom:1px solid #222222;" : ""}">
                          <span style="color:#555555;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Duration</span><br/>
                          <span style="color:#ffffff;font-size:14px;font-weight:600;">${slotDuration}</span>
                        </td>
                      </tr>
                      ${slotNote ? `
                      <tr>
                        <td style="padding:8px 0;">
                          <span style="color:#555555;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Note</span><br/>
                          <span style="color:#aaaaaa;font-size:13px;">${slotNote}</span>
                        </td>
                      </tr>` : ""}
                    </table>
                  </td>
                </tr>
              </table>
              <p style="color:#666666;font-size:13px;line-height:1.8;margin:0 0 35px;">
                The interview link and further instructions will be shared with you shortly before the scheduled time.
              </p>
              <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;">
                <tr>
                  <td align="center" style="background-color:#ea580c;border-radius:2px;">
                    <a href="https://www.nomangames.store" style="display:inline-block;color:#ffffff;font-size:12px;font-weight:800;text-decoration:none;padding:16px 45px;text-transform:uppercase;letter-spacing:2px;">
                      Explore Our Games
                    </a>
                  </td>
                </tr>
              </table>
              <p style="color:#444444;font-size:11px;margin:0;">We look forward to speaking with you.</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#0a0a0a;padding:40px;border-top:1px solid #222222;text-align:center;">
              <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:25px;">
                <tr>
                  <td style="padding:0 15px;"><a href="https://www.linkedin.com/company/nomanprod/"><img src="https://cdn-icons-png.flaticon.com/512/3536/3536505.png" width="18" height="18" alt="LinkedIn" style="filter:invert(1);opacity:0.6;" /></a></td>
                  <td style="padding:0 15px;"><a href="https://www.instagram.com/noman__.games/"><img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" width="18" height="18" alt="Instagram" style="filter:invert(1);opacity:0.6;" /></a></td>
                  <td style="padding:0 15px;"><a href="https://www.youtube.com/channel/UCQWzNg1ToM8umNt0YUaIVhw"><img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" width="18" height="18" alt="YouTube" style="filter:invert(1);opacity:0.6;" /></a></td>
                </tr>
              </table>
              <p style="color:#444444;font-size:10px;margin:0;letter-spacing:1px;line-height:1.6;font-weight:600;text-transform:uppercase;">
                &copy; ${currentYear} NOMAN STUDIOS &middot; CHENNAI, INDIA<br/>
                THIS IS AN AUTOMATED MESSAGE — PLEASE DO NOT REPLY
              </p>
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
      const err = await res.json()
      console.error("❌ Brevo slot email error:", JSON.stringify(err))
    } else {
      console.log("✅ Slot confirmation email sent to", email)
    }
  } catch (err) {
    console.error("❌ Slot email fetch failed:", err)
  }
}

// GET — single slot (public)
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slotId: string }> }
) {
  const { slotId } = await context.params
  try {
    const client = await getMongoClient()
    const db = client.db("noman")

    const slot = await db
      .collection("slots")
      .findOne({ _id: new ObjectId(slotId) })

    if (!slot) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 })
    }

    return NextResponse.json({ slot }, { status: 200 })
  } catch {
    return NextResponse.json({ error: "Failed to fetch slot" }, { status: 500 })
  }
}

// PATCH — book a slot (public) OR unbook (admin)
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ slotId: string }> }
) {
  const { slotId } = await context.params

  try {
    const client = await getMongoClient()
    const db = client.db("noman")

    const slot = await db
      .collection("slots")
      .findOne({ _id: new ObjectId(slotId) })

    if (!slot) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 })
    }

    const body = await req.json()

    // Admin unbook — check auth first, then unbook
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

    // Public booking — check slot availability
    if (slot.isBooked) {
      return NextResponse.json(
        { error: "This slot is already booked" },
        { status: 409 }
      )
    }

    const { name, email } = body

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      )
    }

    // FIX: Verify the booker has a valid invite (placed correctly before booking)
    const invite = await db.collection("invites").findOne({ email: email })

    if (!invite) {
      return NextResponse.json(
        { error: "Access denied. You need a valid invitation to book a slot." },
        { status: 403 }
      )
    }

    // Check if this email already booked any slot
    const existingBooking = await db.collection("slots").findOne({
      "bookedBy.email": email,
    })

    if (existingBooking) {
      return NextResponse.json(
        { error: "You have already booked a slot" },
        { status: 409 }
      )
    }

    await db.collection("slots").updateOne(
      { _id: new ObjectId(slotId) },
      {
        $set: {
          isBooked: true,
          bookedBy: { name, email, bookedAt: new Date() },
        },
      }
    )

    // Send confirmation email
    await sendSlotEmail(
      email,
      name,
      slot.title,
      slot.date,
      slot.time,
      slot.duration,
      slot.note || ""
    )

    return NextResponse.json({ success: true }, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: "Failed to process booking" },
      { status: 500 }
    )
  }
}

// DELETE — remove slot (admin only)
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ slotId: string }> }
) {
  const { slotId } = await context.params
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const client = await getMongoClient()
    const db = client.db("noman")

    await db
      .collection("slots")
      .deleteOne({ _id: new ObjectId(slotId) })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch {
    return NextResponse.json({ error: "Failed to delete slot" }, { status: 500 })
  }
}
