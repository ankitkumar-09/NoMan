import { NextRequest, NextResponse } from "next/server"
import getMongoClient from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import crypto from "crypto"

function isAuthorized(req: NextRequest) {
  return req.headers.get("x-admin-secret") === process.env.ADMIN_SECRET
}

async function sendSlotInviteEmail(
  email: string,
  name: string,
  jobTitle: string,
  bookingUrl: string
) {
  const BREVO_API_KEY = process.env.BREVO_API_KEY
  if (!BREVO_API_KEY) {
    console.error("❌ BREVO_API_KEY missing")
    return
  }

  const currentYear = new Date().getFullYear()

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: "NoMan Game Studio", email: "studios@nomangames.store" },
      to: [{ email, name }],
      subject: `You're In — Book Your Interview Slot | NoMan Game Studio`,
      htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Interview Invitation</title>
</head>

<body style="margin:0;padding:0;background:#050505;font-family:'Segoe UI',Roboto,Arial;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#050505;">
    <tr>
      <td align="center">

       <!-- MAIN CARD -->
<table width="100%" cellpadding="0" cellspacing="0"
  style="max-width:720px;background-color:#0f0f0f;border:1px solid #222;border-radius:4px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,0.8);">

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
              You're invited<br/>to interview
            </h1>

            <div style="width:42px;height:3px;background:#ea580c;margin:18px 0;"></div>

            <p style="margin:0;font-size:14px;color:#777;line-height:1.8;">
              Hi <strong style="color:#fff;">${name}</strong>, we reviewed your application for 
              <strong style="color:#fff;">${jobTitle}</strong> and we'd love to move forward.
            </p>
          </td>

          <!-- RIGHT LOGO -->
          <td align="right" style="vertical-align:top;">
            <img 
              src="https://res.cloudinary.com/dpnpmkhmb/image/upload/v1773735174/1_knbqwl.png"
              width="110"
              style="
                border-radius:10px;
                border:1px solid #2c2c2c;
                box-shadow:0 0 30px rgba(234,88,12,0.2);
              "
            />
          </td>

        </tr>
      </table>
    </td>
  </tr>

  <!-- CTA -->
  <tr>
    <td style="padding:0 52px 36px;">
      <table>
        <tr>
          <td style="background:#ea580c;border-radius:3px;">
            <a href="${bookingUrl}" 
              style="display:inline-block;padding:16px 44px;color:#fff;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">
              Choose Your Slot →
            </a>
          </td>
        </tr>
      </table>

      <p style="margin:12px 0 0;font-size:11px;color:#444;">
        Or copy: <span style="color:#666;">${bookingUrl}</span>
      </p>
    </td>
  </tr>

  <!-- WARNING -->
  <tr>
    <td style="padding:0 52px 36px;">
      <table width="100%">
        <tr>
          <td style="background:#1a1200;border-left:3px solid #f59e0b;padding:16px 20px;">
            <p style="margin:0;color:#f59e0b;font-size:11px;font-weight:700;text-transform:uppercase;">
              Important
            </p>
            <p style="margin:6px 0 0;color:#777;font-size:12px;line-height:1.7;">
              This link is personal and can only be opened twice and only with the email address it was sent to. Do not share it with anyone.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- FOOTER -->
  <tr>
    <td style="background:#0a0a0a;padding:30px 40px;border-top:1px solid #1a1a1a;text-align:center;">
      
      <p style="margin:0 0 6px;font-size:11px;color:#444;">
        This invitation was sent to your registered email.
      </p>

      <p style="margin:0;font-size:10px;color:#333;">
        © ${new Date().getFullYear()} NoMan Game Studio
      </p>

    </td>
  </tr>

</table>
    

</body>
</html>`,
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    console.error("❌ Slot invite email error:", JSON.stringify(err))
    throw new Error("Email send failed")
  } else {
    console.log("✅ Slot invite email sent to", email)
  }
}

// ─── POST — send slot invite to one or many applications ─────────────────────

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Accepts either { applicationId } for single or { applicationIds: [] } for bulk
    const body = await req.json()
    const ids: string[] = body.applicationIds
      ? body.applicationIds
      : body.applicationId
      ? [body.applicationId]
      : []

    if (ids.length === 0) {
      return NextResponse.json(
        { error: "applicationId or applicationIds required" },
        { status: 400 }
      )
    }

    const client = await getMongoClient()
    const db = client.db("noman")

    const results: { id: string; status: "ok" | "skipped" | "error"; reason?: string }[] = []

    for (const applicationId of ids) {
      try {
        const application = await db
          .collection("applications")
          .findOne({ _id: new ObjectId(applicationId) })

        if (!application) {
          results.push({ id: applicationId, status: "skipped", reason: "Application not found" })
          continue
        }

        if (application.status !== "accepted") {
          results.push({ id: applicationId, status: "skipped", reason: "Not accepted" })
          continue
        }

        

        // Check if an invite token already exists for this email
        const existingInvite = await db
          .collection("invites")
          .findOne({ email: application.email })

        let token: string

        if (existingInvite) {
          // Reuse existing token — reset expiry
          token = existingInvite.token
          await db.collection("invites").updateOne(
            { email: application.email },
            {
              $set: {
                isExpired: false,
                visits: 0,
                lastSentAt: new Date(),
              },
            }
          )
        } else {
          // Create a fresh token
          token = crypto.randomBytes(32).toString("hex")
          await db.collection("invites").insertOne({
            token,
            email: application.email,
            name: application.fullName,
            jobTitle: application.jobTitle,
            applicationId: new ObjectId(applicationId),
            visits: 0,
            maxVisits: 5, // candidate can visit booking page up to 5 times
            isExpired: false,
            createdAt: new Date(),
            lastSentAt: new Date(),
          })
        }

        const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.nomangames.store"
        const bookingUrl = `${BASE_URL}/slots?token=${token}`

        await sendSlotInviteEmail(
          application.email,
          application.fullName,
          application.jobTitle,
          bookingUrl
        )

        // Mark the application so we don't double-send
        await db.collection("applications").updateOne(
          { _id: new ObjectId(applicationId) },
          {
            $set: {
              slotInviteSent: true,
              slotInviteSentAt: new Date(),
            },
          }
        )

        results.push({ id: applicationId, status: "ok" })
      } catch (err) {
        console.error(`❌ Failed for ${applicationId}:`, err)
        results.push({ id: applicationId, status: "error", reason: "Send failed" })
      }
    }

    const allOk = results.every((r) => r.status === "ok" || r.status === "skipped")
    return NextResponse.json({ results }, { status: allOk ? 200 : 207 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to process slot invites" }, { status: 500 })
  }
}