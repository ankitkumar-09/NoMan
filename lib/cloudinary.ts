import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export async function uploadResume(
  fileBuffer: Buffer,
  fileName: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log("📤 Uploading file to Cloudinary...")
    console.log("📄 File Name:", fileName)
    console.log("📦 Buffer Size:", fileBuffer.length)

   const uploadStream = cloudinary.uploader.upload_stream(
  {
    resource_type: "raw",
    folder: "noman-resumes",
    public_id: `${Date.now()}-${fileName.replace(/\s+/g, "_").split(".")[0]}`,
    flags: "attachment:false",  // ← add this
  },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary Upload Error:", error)
          return reject(error)
        }

        if (!result) {
          console.error("❌ No result returned from Cloudinary")
          return reject(new Error("Upload failed"))
        }

        console.log("✅ Upload Success!")
        console.log("🔗 URL:", result.secure_url)
        console.log("📁 Resource Type:", result.resource_type)

        resolve(result.secure_url)
      }
    )

    uploadStream.end(fileBuffer)
  })
}