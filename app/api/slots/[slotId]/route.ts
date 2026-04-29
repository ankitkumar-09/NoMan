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
  slotNote: string,
  slotLink: string
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
        subject: `Interview Slot Confirmed — ${slotTitle}`,
        htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Slot Confirmed</title>
</head>

<body style="margin:0;padding:0;background:#050505;font-family:'Segoe UI',Roboto,Arial;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#080808;padding:40px 0;">
<tr>
<td align="center">

<!-- MAIN CARD -->
<table width="100%" cellpadding="0" cellspacing="0"
  style="max-width:720px;background:#0f0f0f;border:1px solid #222;border-radius:4px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,0.8);">

  <!-- HERO -->
  <tr>
    <td style="padding:56px 52px 36px;">
      <table width="100%">
        <tr>
          <!-- LEFT -->
          <td style="vertical-align:top;">
            <p style="margin:0 0 14px;font-size:11px;font-weight:700;letter-spacing:0.25em;color:#ea580c;">
              NOMAN GAME STUDIO
            </p>

            <h1 style="margin:0 0 14px;font-size:36px;font-weight:800;color:#fff;line-height:1.2;">
              Slot Confirmed
            </h1>

            <div style="width:42px;height:3px;background:#ea580c;margin:18px 0;"></div>

            <p style="margin:0;font-size:14px;color:#777;line-height:1.8;">
              Hi <strong style="color:#fff;">${name}</strong>, your interview slot has been successfully booked.
            </p>
          </td>

          <!-- RIGHT LOGO -->
          <td align="right" style="vertical-align:top;">
            <img 
              src="https://res.cloudinary.com/dpnpmkhmb/image/upload/v1773735174/1_knbqwl.png"
              width="110"
              style="border-radius:10px;border:1px solid #2c2c2c;box-shadow:0 0 30px rgba(234,88,12,0.2);"
            />
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- SLOT DETAILS -->
  <tr>
    <td style="padding:0 52px 36px;">
      <table width="100%" style="background:#111;border:1px solid #222;border-radius:4px;">
        <tr>
          <td style="padding:28px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="50%" style="padding-bottom:18px;border-right:1px solid #1a1a1a;padding-right:16px;">
                  <p style="margin:0 0 6px;font-size:11px;color:#555;text-transform:uppercase;">Role</p>
                  <p style="margin:0;font-size:15px;color:#fff;font-weight:700;">${slotTitle}</p>
                </td>
                <td width="50%" style="padding-bottom:18px;padding-left:16px;">
                  <p style="margin:0 0 6px;font-size:11px;color:#555;text-transform:uppercase;">Date</p>
                  <p style="margin:0;font-size:14px;color:#fff;">${formattedDate}</p>
                </td>
              </tr>
              <tr>
                <td style="padding-bottom:18px;border-right:1px solid #1a1a1a;padding-right:16px;">
                  <p style="margin:0 0 6px;font-size:11px;color:#555;text-transform:uppercase;">Time</p>
                  <p style="margin:0;font-size:14px;color:#fff;">${slotTime}</p>
                </td>
                <td style="padding-bottom:18px;padding-left:16px;">
                  <p style="margin:0 0 6px;font-size:11px;color:#555;text-transform:uppercase;">Duration</p>
                  <p style="margin:0;font-size:14px;color:#fff;">${slotDuration}</p>
                </td>
              </tr>
              ${slotNote ? `
              <tr>
                <td colspan="2" style="padding-top:10px;border-top:1px solid #222;">
                  <p style="margin:10px 0 6px;font-size:11px;color:#555;text-transform:uppercase;">Note</p>
                  <p style="margin:0;font-size:13px;color:#aaa;">${slotNote}</p>
                </td>
              </tr>
              ` : ""}
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- JOIN MEETING SECTION -->
  <tr>
    <td style="padding:0 52px 36px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="background:#ea580c;border-radius:4px;padding:18px;">
            <a href="${slotLink}" 
               style="color:#ffffff;text-decoration:none;font-size:16px;font-weight:bold;display:block;">
              JOIN MEETING NOW
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding-top:12px;">
            <p style="margin:0 0 6px;font-size:11px;color:#555;text-transform:uppercase;font-weight:700;">
              Meeting Link:
            </p>
            <p style="margin:0;font-size:12px;color:#777;word-break:break-all;">
              <a href="${slotLink}" style="color:#ea580c;text-decoration:none;">${slotLink}</a>
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- EXPLORE CTA -->
  <tr>
    <td style="padding:0 52px 36px;">
      <table width="100%">
        <tr>
          <td align="left">
            <a href="https://www.nomangames.store"
              style="display:inline-block;color:#777;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border:1px solid #333;padding:10px 20px;border-radius:4px;">
              Explore Our Games →
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- FOOTER -->
  <tr>
    <td style="background:#0a0a0a;padding:30px 40px;border-top:1px solid #1a1a1a;text-align:center;">
      <p style="margin:0 0 6px;font-size:11px;color:#444;">
        We look forward to speaking with you.
      </p>
      <p style="margin:0;font-size:10px;color:#333;">
        © ${currentYear} NoMan Game Studio
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
      slot.note || "",
      slot.link || ""
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
