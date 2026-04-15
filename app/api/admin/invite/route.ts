import { NextRequest, NextResponse } from "next/server"
import getMongoClient from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { randomBytes } from "crypto"

function isAuthorized(req: NextRequest) {
  return req.headers.get("x-admin-secret") === process.env.ADMIN_SECRET
}

async function sendPPTInviteEmail(
  email: string,
  name: string,
  token: string,
  jobTitle: string
) {
  const BREVO_API_KEY = process.env.BREVO_API_KEY
  if (!BREVO_API_KEY) {
    console.error("❌ BREVO_API_KEY missing")
    return
  }
  console.log("🚀 Sending email to:", email)

  const slotLink = `${process.env.NEXT_PUBLIC_SITE_URL}/slots?token=${token}`
  const currentYear = new Date().getFullYear()

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
      subject: `🎮 You're Invited — Book Your Interview Slot | NoMan Studios`,
      htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Interview Invitation</title>
</head>
<body style="margin:0;padding:0;background-color:#050505;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#050505;padding:60px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:500px;background-color:#0f0f0f;border:1px solid #262626;border-radius:2px;overflow:hidden;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding:50px 0 20px;">
              <img src="https://res.cloudinary.com/dpnpmkhmb/image/upload/v1773735174/1_knbqwl.png" alt="NoMan Studios" width="56" height="56" style="display:block;border-radius:4px;border:1px solid #333333;" />
              <div style="height:1px;width:30px;background-color:#ea580c;margin-top:20px;"></div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:0 45px 40px;text-align:center;">
              <h1 style="color:#ffffff;font-size:22px;font-weight:900;margin:0 0 8px;letter-spacing:2px;text-transform:uppercase;">You're Shortlisted!</h1>
              <p style="color:#ea580c;font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 30px;">${jobTitle}</p>

              <p style="color:#888888;font-size:14px;line-height:1.8;margin:0 0 24px;">
                Hi <span style="color:#ffffff;font-weight:700;">${name}</span>,
              </p>
              <p style="color:#888888;font-size:14px;line-height:1.8;margin:0 0 30px;">
                Congratulations! After reviewing your application, we are pleased to invite you for an interview at <span style="color:#ffffff;font-weight:600;">NoMan Studios</span>. Please book your preferred interview slot using the link below.
              </p>

              <!-- Alert Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#1a1100;border:1px solid #3a2800;border-radius:4px;margin-bottom:30px;">
                <tr>
                  <td style="padding:16px 20px;text-align:left;">
                    <p style="color:#f59e0b;font-size:12px;font-weight:700;margin:0 0 4px;text-transform:uppercase;letter-spacing:1px;">⚠ Important</p>
                    <p style="color:#888888;font-size:12px;margin:0;line-height:1.7;">
                      This link is <span style="color:#ffffff;font-weight:600;">personal and unique</span> to you. It can only be accessed <span style="color:#ffffff;font-weight:600;">twice</span> before it expires. Please do not share it with anyone.
                    </p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:30px;">
                <tr><td style="border-top:1px solid #222222;"></td></tr>
              </table>

              <p style="color:#666666;font-size:13px;line-height:1.8;margin:0 0 30px;">
                Click the button below to view available slots and book your preferred time. Once booked, you will receive a confirmation email with further details including the interview link.
              </p>

              <!-- CTA -->
              <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
                <tr>
                  <td align="center" style="background-color:#ea580c;border-radius:2px;">
                    <a href="${slotLink}" style="display:inline-block;color:#ffffff;font-size:12px;font-weight:800;text-decoration:none;padding:18px 50px;text-transform:uppercase;letter-spacing:2px;">
                      Book Your Slot
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color:#444444;font-size:11px;margin:0 0 6px;">Or copy this link:</p>
              <p style="color:#555555;font-size:10px;word-break:break-all;margin:0;">${slotLink}</p>
            </td>
          </tr>

          <!-- Footer -->
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
    console.error("❌ PPT invite email error:", JSON.stringify(err))
  } else {
    console.log("✅ PPT invite sent to", email)
  }
}

// POST — generate token + send invite
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { applicationId } = await req.json()

    if (!applicationId) {
      return NextResponse.json(
        { error: "applicationId required" },
        { status: 400 }
      )
    }

    const client = await getMongoClient()
    const db = client.db("noman")

    // Fetch the application
    const application = await db
      .collection("applications")
      .findOne({ _id: new ObjectId(applicationId) })

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      )
    }

    if (application.status !== "accepted") {
      return NextResponse.json(
        { error: "Only accepted applicants can be invited" },
        { status: 400 }
      )
    }

    // Generate unique token
    const token = randomBytes(32).toString("hex")

    // Save token to invites collection
    await db.collection("invites").updateOne(
      { applicationId: applicationId },
      {
        $set: {
          applicationId,
          email: application.email,
          name: application.fullName,
          jobTitle: application.jobTitle,
          token,
          visits: 0,
          maxVisits: 2,
          isExpired: false,
          createdAt: new Date(),
        },
      },
      { upsert: true }
    )

    // Send email
    await sendPPTInviteEmail(
      application.email,
      application.fullName,
      token,
      application.jobTitle
    )

    // Mark invite sent on application
    await db.collection("applications").updateOne(
      { _id: new ObjectId(applicationId) },
      { $set: { inviteSent: true, inviteSentAt: new Date() } }
    )

    return NextResponse.json({ success: true, token }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Failed to send invite" },
      { status: 500 }
    )
  }
}

