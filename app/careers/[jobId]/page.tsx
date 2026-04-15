"use client"

import { useEffect, useState, useRef, use } from "react"
import { Job } from "@/lib/types"
import {
  MapPin, Clock, Briefcase, CheckCircle2, Loader2,
  Upload, X, ArrowLeft, ChevronRight
} from "lucide-react"
import Link from "next/link"

const YEAR_OPTIONS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduated", "Post-Graduate"]

export default function JobDetailPage({ params }: { params: Promise<{ jobId: string }> }) {
  // Use the React 'use' hook to safely unwrap the params promise
  const { jobId } = use(params)

  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    fullName: "", email: "", phone: "",
    university: "",city:"", degree: "", year: "",
    linkedin: "", portfolio: "", coverLetter: "",
  })

  useEffect(() => {
    if (!jobId) return
    fetch(`/api/jobs/${jobId}`)
      .then((r) => r.json())
      .then((d) => setJob(d.job))
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false))
  }, [jobId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (formStatus === "error") setFormStatus("idle")
  }

  const handleResume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== "application/pdf") {
      setErrorMsg("Only PDF files are accepted")
      setFormStatus("error")
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg("Resume must be under 2MB")
      setFormStatus("error")
      return
    }
    setResumeFile(file)
    setFormStatus("idle")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resumeFile) {
      setErrorMsg("Please upload your resume")
      setFormStatus("error")
      return
    }

    setFormStatus("loading")
    setErrorMsg("")

    const fd = new FormData()
    fd.append("jobId", jobId)
    fd.append("jobTitle", job?.title || "")
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    fd.append("resume", resumeFile)

    try {
      const res = await fetch("/api/applications", { method: "POST", body: fd })
      if (res.status === 409) {
        setErrorMsg("You've already applied for this role.")
        setFormStatus("error")
        return
      }
      if (!res.ok) throw new Error()
      setFormStatus("success")
    } catch {
      setErrorMsg("Something went wrong. Please try again.")
      setFormStatus("error")
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
    </div>
  )

  if (!job) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white gap-4">
      <p className="text-white/40">Job not found.</p>
      <Link href="/careers" className="text-orange-500 text-sm hover:underline">← Back to Careers</Link>
    </div>
  )

  return (
    <main className="min-h-screen bg-black text-white pb-32">
      <div className="max-w-5xl mx-auto px-4 pt-28 pb-6">
        <Link href="/careers" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Careers
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Job Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4 sticky top-28">
            <span className="text-[11px] text-orange-400 font-semibold uppercase tracking-widest">{job.department}</span>
            <h1 className="text-2xl font-bold mt-1">{job.title}</h1>
            <div className="flex flex-col gap-2 text-white/50 text-sm">
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4" />{job.location}</span>
              <span className="flex items-center gap-2"><Clock className="w-4 h-4" />{job.experience}</span>
              <span className="flex items-center gap-2"><Briefcase className="w-4 h-4" />{job.type}</span>
            </div>
            <div className="border-t border-white/10 pt-4">
              <p className="font-semibold">Description</p>
              <p className="text-white/60 text-sm leading-relaxed">{job.description}</p>
            </div>
              <p className="font-semibold">Responsibilities</p>
              <p className="text-white/60 text-sm leading-relaxed">{job.responsibilities}</p>
          
          </div>
  
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-2">
          {formStatus === "success" ? (
            <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
              <CheckCircle2 className="w-14 h-14 text-orange-500" />
              <h2 className="text-2xl font-bold">Application Submitted!</h2>
              <Link href="/careers" className="mt-4 px-6 py-3 rounded-xl bg-orange-600 text-white font-bold">More Openings</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <Section title="Personal Info">
                <Row>
                  <Field label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} required />
                  <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
                </Row>
                <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} required />
              </Section>

              <Section title="Education">
                <Row>
                  <Field label="University" name="university" value={form.university} onChange={handleChange} required />
                   <Field label="City/State" name="city" value={form.city} onChange={handleChange} required />
                </Row>
                <Row>
                  <Field label="Degree" name="degree" value={form.degree} onChange={handleChange} required />
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-xs text-white/40 uppercase font-bold tracking-wider">Year</label>
                    <select name="year" value={form.year} onChange={handleChange} required className="px-4 py-3 rounded-xl bg-black border border-white/10 text-white text-sm outline-none">
                      <option value="">Select Year</option>
                      {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </Row>
              </Section>

              <Section title="Resume (PDF)">
                <div onClick={() => fileRef.current?.click()} className={`p-8 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${resumeFile ? "border-orange-500/50 bg-orange-500/5" : "border-white/10 hover:border-white/20"}`}>
                  <input ref={fileRef} type="file" hidden accept=".pdf" onChange={handleResume} />
                  {resumeFile ? <p className="text-orange-500 font-bold">{resumeFile.name}</p> : <p className="text-white/40">Click to upload PDF</p>}
                </div>
              </Section>

              {errorMsg && <p className="text-red-400 text-sm text-center">{errorMsg}</p>}
              <button type="submit" disabled={formStatus === "loading"} className="w-full bg-orange-600 py-4 rounded-2xl font-bold hover:bg-orange-500 transition-all disabled:opacity-50">
                {formStatus === "loading" ? "Submitting..." : "Apply Now"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="space-y-4 p-6 rounded-2xl bg-white/[0.02] border border-white/10"><h3 className="text-xs font-bold uppercase tracking-widest text-orange-500">{title}</h3>{children}</div>
}
function Row({ children }: { children: React.ReactNode }) { return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div> }
function Field({ label, name, ...props }: { label: string; name: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return <div className="flex flex-col gap-1.5 w-full"><label className="text-xs text-white/40 uppercase font-bold tracking-wider">{label}</label><input {...props} name={name} className="px-4 py-3 rounded-xl bg-black border border-white/10 focus:border-orange-500/50 text-white text-sm outline-none" /></div>
}