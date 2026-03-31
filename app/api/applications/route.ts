import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { uploadResume } from "@/lib/cloudinary"
import { Application } from "@/lib/types"

// REMOVED: export const config = { api: { bodyParser: false } }
// In App Router, req.formData() handles the stream automatically.

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    // Extract resume file
    const resumeFile = formData.get("resume") as File | null
    if (!resumeFile) {
      return NextResponse.json({ error: "Resume is required" }, { status: 400 })
    }

    // Vercel free limit — 4.5MB
    if (resumeFile.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Resume must be under 4MB" },
        { status: 400 }
      )
    }

    // Upload to Cloudinary
    const arrayBuffer = await resumeFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const resumeUrl = await uploadResume(buffer, resumeFile.name)

    // Build application object
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

    // Check duplicate — same email + same job
    const client = await clientPromise
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

    const result = await db.collection("applications").insertOne(application)

    return NextResponse.json({ id: result.insertedId }, { status: 201 })
  } catch (err) {
    console.error("Application submission error:", err)
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    )
  }
}