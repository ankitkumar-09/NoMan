// app/api/apply/route.ts  (your existing file — only sendApplicationEmail changed)
//
// The rest of the POST handler is identical to your original.
// Only sendApplicationEmail now fetches the template from MongoDB
// and falls back to the hardcoded default if none is saved.

import { NextRequest, NextResponse } from "next/server"
import getMongoClient from "@/lib/mongodb"
import { uploadResume } from "@/lib/cloudinary"
import { Application } from "@/lib/types"

// ─── Default template (identical to your original) ────────────────────────────
// Kept here as the fallback in case no custom template has been saved yet.
const DEFAULT_SUBJECT = "🎮 Application Received — {{jobTitle}}"

const DEFAULT_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Application Received</title>
</head>
<body style="margin:0;padding:0;background-color:#050505;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#050505;padding:60px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:500px;background-color:#0f0f0f;border:1px solid #262626;border-radius:2px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.5);">
          <tr>
            <td align="center" style="padding:50px 0 20px;">
              <img src="https://res.cloudinary.com/dpnpmkhmb/image/upload/v1773735174/1_knbqwl.png" alt="NoMan Studios" width="56" height="56" style="display:block;border-radius:4px;border:1px solid #333333;" />
              <div style="height:1px;width:30px;background-color:#ea580c;margin-top:20px;"></div>
            </td>
          </tr>
          <tr>
            <td style="padding:0 45px 40px;text-align:center;">
              <h1 style="color:#ffffff;font-size:22px;font-weight:900;margin:0 0 8px;letter-spacing:2px;text-transform:uppercase;">Application Received</h1>
              <p style="color:#ea580c;font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 30px;">{{jobTitle}}</p>
              <p style="color:#888888;font-size:15px;line-height:1.9;margin:0 0 24px;">
                Hi <span style="color:#ffffff;font-weight:700;">{{name}}</span>,
              </p>
              <p style="color:#888888;font-size:14px;line-height:1.9;margin:0 0 30px;">
                Thank you for applying to <span style="color:#ffffff;font-weight:600;">{{jobTitle}}</span> at <span style="color:#ffffff;font-weight:600;">NoMan Studios</span>. We have received your application and our team will carefully review it.
              </p>
              <p style="color:#666666;font-size:13px;line-height:1.8;margin:0 0 35px;">
                If shortlisted, we will reach out to you directly. In the meantime, feel free to explore our games and stay connected with us on social media.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:30px;">
                <tr><td style="border-top:1px solid #222222;"></td></tr>
              </table>
              <p style="color:#666666;font-size:13px;line-height:1.8;margin:0 0 35px;max-width:340px;display:inline-block;">
                While you wait, explore our games and follow our journey — we're building something exciting.
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
              <p style="color:#444444;font-size:11px;margin:0;letter-spacing:0.5px;">
                We'll be in touch if your profile is a match.
              </p>
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
                &copy; {{year}} NOMAN STUDIOS &middot; CHENNAI, INDIA<br/>
                THIS IS AN AUTOMATED MESSAGE — PLEASE DO NOT REPLY
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

// ─── POST /api/apply ──────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    const resumeFile = formData.get("resume") as File | null
    if (!resumeFile) {
      return NextResponse.json({ error: "Resume is required" }, { status: 400 })
    }

    if (resumeFile.size > 4 * 1024 * 1024) {
      return NextResponse.json({ error: "Resume must be under 4MB" }, { status: 400 })
    }

    const arrayBuffer = await resumeFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const resumeUrl = await uploadResume(buffer, resumeFile.name)

    const application: Application = {
      jobId: (formData.get("jobId") as string) || "",
      jobTitle: (formData.get("jobTitle") as string) || "",
      fullName: (formData.get("fullName") as string) || "",
      email: (formData.get("email") as string) || "",
      phone: (formData.get("phone") as string) || "",
      university: (formData.get("university") as string) || "",
      college: (formData.get("college") as string) || "",
      degree: (formData.get("degree") as string) || "",
      year: (formData.get("year") as string) || "",
      linkedin: (formData.get("linkedin") as string) || "",
      portfolio: (formData.get("portfolio") as string) || "",
      coverLetter: (formData.get("coverLetter") as string) || "",
      resumeUrl,
      resumeFileName: resumeFile.name,
      status: "pending",
      appliedAt: new Date(),
    }

    const client = await getMongoClient()
    const db = client.db("noman")

    const existing = await db.collection("applications").findOne({
      jobId: application.jobId,
      email: application.email,
    })

    if (existing) {
      return NextResponse.json(
        { error: "You have already applied for this role" },
        { status: 409 }
      )
    }

    const { _id, ...insertData } = application
    const result = await db.collection("applications").insertOne(insertData)

    // Send confirmation email using the saved template (or default)
    await sendApplicationEmail(db, application.email, application.fullName, application.jobTitle)

    return NextResponse.json({ id: result.insertedId }, { status: 201 })
  } catch (err) {
    console.error("Application submission error:", err)
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
  }
}

// ─── Email sender (now reads template from DB) ────────────────────────────────

async function sendApplicationEmail(
  db: Awaited<ReturnType<typeof getMongoClient>> extends infer C
    ? C extends { db: (...a: any[]) => infer D } ? D : never
    : never,
  email: string,
  name: string,
  jobTitle: string
) {
  const BREVO_API_KEY = process.env.BREVO_API_KEY
  if (!BREVO_API_KEY) return

  // Try to load custom template from DB
  const templateDoc = await db
    .collection("settings")
    .findOne({ key: "applicationEmailTemplate" })

  const rawHtml = (templateDoc?.html as string) || DEFAULT_HTML
  const rawSubject = (templateDoc?.subject as string) || DEFAULT_SUBJECT

  const currentYear = new Date().getFullYear().toString()

  // Replace template variables
  const htmlContent = rawHtml
    .replace(/\{\{name\}\}/g, name)
    .replace(/\{\{jobTitle\}\}/g, jobTitle)
    .replace(/\{\{year\}\}/g, currentYear)

  const subject = rawSubject
    .replace(/\{\{name\}\}/g, name)
    .replace(/\{\{jobTitle\}\}/g, jobTitle)
    .replace(/\{\{year\}\}/g, currentYear)

  await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: "NoMan Studios", email: "studios@nomangames.store" },
      to: [{ email, name }],
      subject,
      htmlContent,
    }),
  })
}