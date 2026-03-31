export interface Job {
  _id?: string
  title: string
  department: string
  location: string
  type: "Full-Time" | "Part-Time" | "Internship" | "Contract"
  experience: string
  description: string
  responsibilities: string[]
  requirements: string[]
  isOpen: boolean
  createdAt: Date
}

export interface Application {
  _id?: string
  jobId: string
  jobTitle: string

  // Personal
  fullName: string
  email: string
  phone: string

  // Academic
  university: string
  college: string
  degree: string
  year: string

  // Professional
  linkedin: string
  portfolio: string
  coverLetter: string

  // Resume
  resumeUrl: string
  resumeFileName: string

  status: "pending" | "reviewing" | "accepted" | "rejected"
  appliedAt: Date
}