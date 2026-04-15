// import { NextRequest, NextResponse } from "next/server"
// import clientPromise from "@/lib/mongodb"
// import { ObjectId } from "mongodb"
// import { randomBytes } from "crypto"

// function isAuthorized(req: NextRequest) {
//   return req.headers.get("x-admin-secret") === process.env.ADMIN_SECRET
// }

// async function sendPPTInviteEmail(
//   email: string,
//   name: string,
//   token: string,
//   jobTitle: string
// ) {
//   const BREVO_API_KEY = process.env.BREVO_API_KEY
//   if (!BREVO_API_KEY) {
//     console.error("❌ BREVO_API_KEY missing")
//     return
//   }
//   console.log("🚀 Sending email to:", email)

//   const slotLink = `${process.env.NEXT_PUBLIC_SITE_URL}/slots?token=${token}`
//   const currentYear = new Date().getFullYear()

//   const res = await fetch("https://api.brevo.com/v3/smtp/email", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "api-key": BREVO_API_KEY,
//     },
//     body: JSON.stringify({
//       sender: {
//         name: "NoMan Studios",
//         email: "studios@nomangames.store",
//       },
//       to: [{ email, name }],
//       subject: `You're Shortlisted — Book Your Interview Slot | NoMan Studios`,
//       htmlContent: `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8" />
//   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//   <title>You're Shortlisted</title>
// </head>
// <body style="margin:0;padding:0;background-color:#050505;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
//   <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#080808;padding:50px 20px;">
//     <tr>
//       <td align="center">
//         <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background-color:#0f0f0f;border:1px solid #222222;border-radius:3px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,0.8);">

//           <!-- HERO -->
//           <tr>
//             <td style="padding:0;">
//               <table width="100%" cellpadding="0" cellspacing="0" border="0">
//                 <tr>
//                   <td width="48%" valign="middle" style="padding:52px 32px;background-color:#0a0a0a;border-right:1px solid #1c1c1c;">
//                     <p style="margin:0 0 14px;color:#ea580c;font-size:9px;font-weight:800;letter-spacing:4px;text-transform:uppercase;">NoMan Studios</p>
//                     <h2 style="margin:0;color:#ffffff;font-size:22px;font-weight:900;line-height:1.25;letter-spacing:-0.3px;">Committed<br/>to<br/>Entertainment.</h2>
//                     <div style="height:2px;width:28px;background-color:#ea580c;margin-top:20px;"></div>
//                     <p style="margin:18px 0 0;color:#555555;font-size:11px;line-height:1.75;letter-spacing:0.3px;">Building worlds.<br/>Crafting experiences.<br/>Hiring the bold.</p>
//                   </td>
//                   <td width="52%" valign="middle" style="background:linear-gradient(160deg,#0e1218 0%,#121a14 60%,#0a0d0a 100%);padding:0;text-align:center;">
//                     <table width="100%" cellpadding="0" cellspacing="0" border="0">
//                       <tr>
//                         <td width="14" height="14" style="border-top:1px dotted #282828;border-left:1px dotted #282828;"></td>
//                         <td></td>
//                         <td width="14" height="14" style="border-top:1px dotted #282828;border-right:1px dotted #282828;"></td>
//                       </tr>
//                       <tr>
//                         <td></td>
//                         <td style="padding:40px 20px;text-align:center;">
//                           <img
//                             src="https://res.cloudinary.com/dpnpmkhmb/image/upload/v1773735174/1_knbqwl.png"
//                             alt="NoMan Studios"
//                             width="110"
//                             height="110"
//                             style="display:block;margin:0 auto 18px;border-radius:8px;border:1px solid #2c2c2c;box-shadow:0 0 40px rgba(234,88,12,0.12),0 8px 24px rgba(0,0,0,0.6);"
//                           />
//                           <p style="margin:0 0 4px;color:#ffffff;font-size:12px;font-weight:800;letter-spacing:3px;text-transform:uppercase;">NoMan Studios</p>
//                           <p style="margin:0;color:#ea580c;font-size:9px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;">Game Development</p>
//                         </td>
//                         <td></td>
//                       </tr>
//                       <tr>
//                         <td width="14" height="14" style="border-bottom:1px dotted #282828;border-left:1px dotted #282828;"></td>
//                         <td></td>
//                         <td width="14" height="14" style="border-bottom:1px dotted #282828;border-right:1px dotted #282828;"></td>
//                       </tr>
//                     </table>
//                   </td>
//                 </tr>
//               </table>
//             </td>
//           </tr>

//           <!-- BODY -->
//           <tr>
//             <td style="padding:48px 48px 44px;text-align:center;">

//               <h1 style="color:#ffffff;font-size:20px;font-weight:900;margin:0 0 8px;letter-spacing:1.5px;text-transform:uppercase;">You're Shortlisted!</h1>
//               <p style="color:#ea580c;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 32px;">${jobTitle}</p>

//               <p style="color:#888888;font-size:15px;line-height:1.9;margin:0 0 20px;">
//                 Hi <span style="color:#ffffff;font-weight:700;">${name}</span>,
//               </p>

//               <p style="color:#777777;font-size:14px;line-height:1.9;margin:0 0 16px;">
//                 Congratulations! After carefully reviewing your application for
//                 <span style="color:#ffffff;font-weight:600;">${jobTitle}</span> at
//                 <span style="color:#ffffff;font-weight:600;">NoMan Studios</span>, we are pleased to move you to the next stage.
//               </p>

//               <p style="color:#777777;font-size:14px;line-height:1.9;margin:0 0 32px;">
//                 Please book your preferred interview slot using the link below. Once booked, you will receive a confirmation email with further details including the interview link.
//               </p>

//               <!-- Status pill -->
//               <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
//                 <tr>
//                   <td style="background-color:#141414;border:1px solid #2a2a2a;border-left:3px solid #ea580c;border-radius:2px;padding:14px 28px;">
//                     <p style="margin:0;color:#aaaaaa;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">
//                       &#9679;&nbsp; Status: Shortlisted
//                     </p>
//                   </td>
//                 </tr>
//               </table>

//               <!-- Warning -->
//               <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
//                 <tr>
//                   <td style="background-color:#1a1100;border:1px solid #3a2800;border-left:3px solid #f59e0b;border-radius:2px;padding:16px 20px;text-align:left;">
//                     <p style="color:#f59e0b;font-size:11px;font-weight:700;margin:0 0 4px;text-transform:uppercase;letter-spacing:1px;">⚠ Important</p>
//                     <p style="color:#888888;font-size:12px;margin:0;line-height:1.7;">
//                       This link is <span style="color:#ffffff;font-weight:600;">personal and unique</span> to you. It can only be accessed <span style="color:#ffffff;font-weight:600;">twice</span> before it expires. Please do not share it with anyone.
//                     </p>
//                   </td>
//                 </tr>
//               </table>

//               <!-- Divider -->
//               <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
//                 <tr><td style="border-top:1px solid #1e1e1e;"></td></tr>
//               </table>

//               <p style="color:#444444;font-size:12px;line-height:1.8;margin:0 0 28px;">
//                 Click the button below to view available slots and book your preferred time.
//               </p>

//               <!-- CTA -->
//               <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;">
//                 <tr>
//                   <td style="background-color:#ea580c;border-radius:2px;">
//                     <a href="${slotLink}" style="display:inline-block;color:#ffffff;font-size:11px;font-weight:800;text-decoration:none;padding:15px 40px;text-transform:uppercase;letter-spacing:2px;">
//                       Book Your Slot
//                     </a>
//                   </td>
//                 </tr>
//               </table>

//               <p style="color:#333333;font-size:11px;margin:14px 0 0;letter-spacing:0.3px;">
//                 We'll be in touch with further details after your slot is confirmed.
//               </p>
//             </td>
//           </tr>

//           <!-- FOOTER -->
//           <tr>
//             <td style="background-color:#0a0a0a;padding:32px 40px;border-top:1px solid #1a1a1a;text-align:center;">
//               <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
//                 <tr>
//                   <td style="padding:0 13px;">
//                     <a href="https://www.linkedin.com/company/nomanprod/">
//                       <img src="https://cdn-icons-png.flaticon.com/512/3536/3536505.png" width="15" height="15" alt="LinkedIn" style="filter:invert(1);opacity:0.45;" />
//                     </a>
//                   </td>
//                   <td style="padding:0 13px;">
//                     <a href="https://www.instagram.com/noman__.games/">
//                       <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" width="15" height="15" alt="Instagram" style="filter:invert(1);opacity:0.45;" />
//                     </a>
//                   </td>
//                   <td style="padding:0 13px;">
//                     <a href="https://www.youtube.com/channel/UCQWzNg1ToM8umNt0YUaIVhw">
//                       <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" width="15" height="15" alt="YouTube" style="filter:invert(1);opacity:0.45;" />
//                     </a>
//                   </td>
//                 </tr>
//               </table>
//               <p style="color:#333333;font-size:10px;margin:0;letter-spacing:1px;line-height:1.8;font-weight:600;text-transform:uppercase;">
//                 &copy; ${currentYear} NOMAN STUDIOS &middot; CHENNAI, INDIA<br/>
//                 THIS IS AN AUTOMATED MESSAGE — PLEASE DO NOT REPLY
//               </p>
//             </td>
//           </tr>

//         </table>
//       </td>
//     </tr>
//   </table>
// </body>
// </html>`,
//     }),
//   })

//   if (!res.ok) {
//     const err = await res.json()
//     console.error("❌ PPT invite email error:", JSON.stringify(err))
//   } else {
//     console.log("✅ PPT invite sent to", email)
//   }
// }

// // POST — generate token + send invite
// export async function POST(req: NextRequest) {
//   if (!isAuthorized(req)) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//   }

//   try {
//     const { applicationId } = await req.json()

//     if (!applicationId) {
//       return NextResponse.json(
//         { error: "applicationId required" },
//         { status: 400 }
//       )
//     }

//     const client = await clientPromise
//     const db = client.db("noman")

//     const application = await db
//       .collection("applications")
//       .findOne({ _id: new ObjectId(applicationId) })

//     if (!application) {
//       return NextResponse.json(
//         { error: "Application not found" },
//         { status: 404 }
//       )
//     }

//     if (application.status !== "accepted") {
//       return NextResponse.json(
//         { error: "Only accepted applicants can be invited" },
//         { status: 400 }
//       )
//     }

//     const token = randomBytes(32).toString("hex")

//     await db.collection("invites").updateOne(
//       { applicationId: applicationId },
//       {
//         $set: {
//           applicationId,
//           email: application.email,
//           name: application.fullName,
//           jobTitle: application.jobTitle,
//           token,
//           visits: 0,
//           maxVisits: 2,
//           isExpired: false,
//           createdAt: new Date(),
//         },
//       },
//       { upsert: true }
//     )

//     await sendPPTInviteEmail(
//       application.email,
//       application.fullName,
//       token,
//       application.jobTitle
//     )

//     await db.collection("applications").updateOne(
//       { _id: new ObjectId(applicationId) },
//       { $set: { inviteSent: true, inviteSentAt: new Date() } }
//     )

//     return NextResponse.json({ success: true, token }, { status: 200 })
//   } catch (err) {
//     console.error(err)
//     return NextResponse.json(
//       { error: "Failed to send invite" },
//       { status: 500 }
//     )
//   }
// }


import { NextRequest, NextResponse } from "next/server"
import getMongoClient from "@/lib/mongodb"
import { ObjectId } from "mongodb"

function isAuthorized(req: NextRequest) {
  return req.headers.get("x-admin-secret") === process.env.ADMIN_SECRET
}

async function sendStatusUpdateEmail(
  email: string,
  name: string,
  jobTitle: string
) {
  const BREVO_API_KEY = process.env.BREVO_API_KEY
  if (!BREVO_API_KEY) {
    console.error("❌ BREVO_API_KEY missing")
    return
  }
  console.log("🚀 Sending status update email to:", email)

  const currentYear = new Date().getFullYear()

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: {
        name: "NoMan Studio",
        email: "studios@nomangames.store",
      },
      to: [{ email, name }],
      subject: `Application Update — ${jobTitle} | NoMan Studio`,
      htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Application Update</title>
</head>
<body style="margin:0;padding:0;background-color:#050505;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#080808;padding:40px 0px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:900px;background-color:#0f0f0f;border:1px solid #222222;border-radius:3px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,0.8);">

          <!-- HERO -->
          <tr>
            <td style="padding:0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="48%" valign="middle" style="padding:72px 52px;background-color:#0a0a0a;border-right:1px solid #1c1c1c;">
  <p style="margin:0 0 14px;color:#ea580c;font-size:10px;font-weight:800;letter-spacing:5px;text-transform:uppercase;">NoMan Studio</p>
  <h2 style="margin:0;color:#ffffff;font-size:32px;font-weight:900;line-height:1.2;letter-spacing:-0.5px;">Committed<br/>to<br/>Entertainment.</h2>
  <div style="height:2px;width:36px;background-color:#ea580c;margin-top:24px;"></div>
  <p style="margin:22px 0 0;color:#555555;font-size:12px;line-height:1.9;letter-spacing:0.5px;">Building worlds.<br/>Crafting experiences.<br/>Hiring the bold.</p>
</td>
                  <td width="52%" valign="middle" style="background:linear-gradient(160deg,#0e1218 0%,#121a14 60%,#0a0d0a 100%);padding:0;text-align:center;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="14" height="14" style="border-top:1px dotted #282828;border-left:1px dotted #282828;"></td>
                        <td></td>
                        <td width="14" height="14" style="border-top:1px dotted #282828;border-right:1px dotted #282828;"></td>
                      </tr>
                      <tr>
                        <td></td>
                        <td style="padding:40px 20px;text-align:center;">
                         <img
  src="https://res.cloudinary.com/dpnpmkhmb/image/upload/v1773735174/1_knbqwl.png"
  alt="NoMan Studio"
  width="140"
  height="140"
  style="display:block;margin:0 auto 20px;border-radius:10px;border:1px solid #2c2c2c;box-shadow:0 0 60px rgba(234,88,12,0.15),0 8px 32px rgba(0,0,0,0.7);"
/>
<p style="margin:0 0 6px;color:#ffffff;font-size:14px;font-weight:800;letter-spacing:4px;text-transform:uppercase;">NoMan Studio</p>
<p style="margin:0;color:#ea580c;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">Game Development</p>
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td width="14" height="14" style="border-bottom:1px dotted #282828;border-left:1px dotted #282828;"></td>
                        <td></td>
                        <td width="14" height="14" style="border-bottom:1px dotted #282828;border-right:1px dotted #282828;"></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:48px 48px 44px;text-align:center;">

              <h1 style="color:#ffffff;font-size:20px;font-weight:900;margin:0 0 8px;letter-spacing:1.5px;text-transform:uppercase;">Application Under Review</h1>
              <p style="color:#ea580c;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 32px;">${jobTitle}</p>

              <p style="color:#888888;font-size:15px;line-height:1.9;margin:0 0 20px;">
                Hi <span style="color:#ffffff;font-weight:700;">${name}</span>,
              </p>

              <p style="color:#777777;font-size:14px;line-height:1.9;margin:0 0 16px;">
                Thank you for applying to <span style="color:#ffffff;font-weight:600;">${jobTitle}</span> at
                <span style="color:#ffffff;font-weight:600;">NoMan Studio</span>.
              </p>

              <p style="color:#777777;font-size:14px;line-height:1.9;margin:0 0 32px;">
                Your application is currently being reviewed by our team. If you are shortlisted, we will reach out to you on this email with an invitation to our <span style="color:#ffffff;font-weight:600;">PPT round</span> along with all further details.
              </p>

              <!-- Status pill -->
              <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:40px;">
                <tr>
                  <td style="background-color:#141414;border:1px solid #2a2a2a;border-left:3px solid #ea580c;border-radius:2px;padding:14px 28px;">
                    <p style="margin:0;color:#aaaaaa;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">
                      &#9679;&nbsp; Status: Under Review
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
                <tr><td style="border-top:1px solid #1e1e1e;"></td></tr>
              </table>

              <p style="color:#444444;font-size:12px;line-height:1.8;margin:0 0 28px;">
                While you wait, explore our games and follow our journey.
              </p>

              <!-- CTA -->
              <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:10px;">
                <tr>
                  <td style="background-color:#ea580c;border-radius:2px;">
                    <a href="https://www.nomangames.store" style="display:inline-block;color:#ffffff;font-size:11px;font-weight:800;text-decoration:none;padding:15px 40px;text-transform:uppercase;letter-spacing:2px;">
                      Explore Our Games
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color:#333333;font-size:13px;margin:14px 0 0;letter-spacing:0.3px;">
                We'll reach out if your profile is a match.
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color:#0a0a0a;padding:32px 40px;border-top:1px solid #1a1a1a;text-align:center;">
              <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
                <tr>
                  <td style="padding:0 13px;">
                    <a href="https://www.linkedin.com/company/nomanprod/">
                      <img src="https://cdn-icons-png.flaticon.com/512/3536/3536505.png" width="15" height="15" alt="LinkedIn" style="filter:invert(1);opacity:0.45;" />
                    </a>
                  </td>
                  <td style="padding:0 13px;">
                    <a href="https://www.instagram.com/noman__.games/">
                      <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" width="15" height="15" alt="Instagram" style="filter:invert(1);opacity:0.45;" />
                    </a>
                  </td>
                  <td style="padding:0 13px;">
                    <a href="https://www.youtube.com/channel/UCQWzNg1ToM8umNt0YUaIVhw">
                      <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" width="15" height="15" alt="YouTube" style="filter:invert(1);opacity:0.45;" />
                    </a>
                  </td>
                </tr>
              </table>
              <p style="color:#333333;font-size:12px;margin:0;letter-spacing:1px;line-height:1.8;font-weight:600;text-transform:uppercase;">
                &copy; ${currentYear} NOMAN STUDIO &middot; CHENNAI, INDIA<br/>
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
    console.error("❌ Status update email error:", JSON.stringify(err))
  } else {
    console.log("✅ Status update email sent to", email)
  }
}

// POST — send status update email
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
        { error: "Only accepted applicants can be notified" },
        { status: 400 }
      )
    }

    await sendStatusUpdateEmail(
      application.email,
      application.fullName,
      application.jobTitle
    )

    await db.collection("applications").updateOne(
      { _id: new ObjectId(applicationId) },
      { $set: { statusEmailSent: true, statusEmailSentAt: new Date() } }
    )

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Failed to send status update email" },
      { status: 500 }
    )
  }
}

