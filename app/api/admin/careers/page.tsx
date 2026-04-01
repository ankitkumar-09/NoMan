"use client"

import { useEffect, useState } from "react"
import { Job, Application } from "@/lib/types"
import {
  Plus, X, Loader2, ChevronDown, ChevronUp,
  Briefcase, Users, ToggleLeft, ToggleRight,
  Trash2, ExternalLink, FileText
} from "lucide-react"

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-600/15 text-yellow-400 border-yellow-500/30",
  reviewing: "bg-blue-600/15 text-blue-400 border-blue-500/30",
  accepted: "bg-green-600/15 text-green-400 border-green-500/30",
  rejected: "bg-red-600/15 text-red-400 border-red-500/30",
}

const DEPARTMENTS = ["Engineering", "Design", "Art", "Marketing", "Production", "QA", "Other"]
const JOB_TYPES = ["Full-Time", "Part-Time", "Internship", "Contract"]

const BLANK_JOB = {
  title: "", department: "Engineering", location: "", type: "Full-Time",
  experience: "", description: "", responsibilities: "", requirements: "",
}

export default function AdminCareersPage() {
  const [secret, setSecret] = useState("")
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState("")

  const [tab, setTab] = useState<"jobs" | "applications">("jobs")
  const [jobs, setJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(false)

  const [showJobForm, setShowJobForm] = useState(false)
  const [jobForm, setJobForm] = useState(BLANK_JOB)
  const [jobFormLoading, setJobFormLoading] = useState(false)
  const [jobFormError, setJobFormError] = useState("")

  const [expandedJob, setExpandedJob] = useState<string | null>(null)
  const [filterJob, setFilterJob] = useState("All")
  const [filterStatus, setFilterStatus] = useState("All")

  const headers = { "x-admin-secret": secret, "Content-Type": "application/json" }

  // ── Auth ──
  const handleAuth = async () => {
  if (!secret.trim()) {
    setAuthError("Please enter the admin secret.")
    return
  }
  setLoading(true)
  setAuthError("")
  try {
    const res = await fetch("/api/jobs", { headers: { "x-admin-secret": secret } })
    if (res.ok) {
      setAuthed(true)
      fetchAll()
    } else {
      setAuthError("Invalid secret. Try again.")
    }
  } catch {
    setAuthError("Something went wrong. Try again.")
  } finally {
    setLoading(false)
  }
}

  // ── Fetch ──
  const fetchAll = async () => {
    setLoading(true)
    try {
      const [jobsRes, appsRes] = await Promise.all([
        fetch("/api/jobs", { headers }),
        fetch("/api/admin/applications", { headers }),
      ])
      const jobsData = await jobsRes.json()
      const appsData = await appsRes.json()
      setJobs(jobsData.jobs || [])
      setApplications(appsData.applications || [])
    } catch (err) {
      console.error("Fetch failed", err)
    } finally {
      setLoading(false)
    }
  }

  // ── Post Job ──
  const handlePostJob = async () => {
    if (!jobForm.title || !jobForm.location || !jobForm.experience || !jobForm.description) {
      setJobFormError("Please fill all required fields.")
      return
    }
    setJobFormLoading(true)
    setJobFormError("")
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers,
      body: JSON.stringify({
        ...jobForm,
        responsibilities: jobForm.responsibilities.split("\n").filter(Boolean),
        requirements: jobForm.requirements.split("\n").filter(Boolean),
      }),
    })
    if (res.ok) {
      setShowJobForm(false)
      setJobForm(BLANK_JOB)
      fetchAll()
    } else {
      setJobFormError("Failed to post job.")
    }
    setJobFormLoading(false)
  }

  // ── Toggle Job ──
  const toggleJob = async (jobId: string, isOpen: boolean) => {
    await fetch(`/api/jobs/${jobId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ isOpen: !isOpen }),
    })
    fetchAll()
  }

  // ── Delete Job ──
  const deleteJob = async (jobId: string) => {
    if (!confirm("Delete this job posting?")) return
    await fetch(`/api/jobs/${jobId}`, { method: "DELETE", headers })
    fetchAll()
  }

  // ── Update Status ──
  const updateStatus = async (applicationId: string, status: string) => {
    await fetch("/api/admin/applications", {
      method: "PATCH",
      headers,
      body: JSON.stringify({ applicationId, status }),
    })
    fetchAll()
  }

  // ── Delete Application ──
  const deleteApplication = async (applicationId: string) => {
    if (!confirm("Delete this application?")) return
    await fetch("/api/admin/applications", {
      method: "DELETE",
      headers,
      body: JSON.stringify({ applicationId }),
    })
    fetchAll()
  }

  // ── Filtered Applications ──
  const filteredApps = applications.filter((a) => {
    const jobMatch = filterJob === "All" || a.jobId === filterJob
    const statusMatch = filterStatus === "All" || a.status === filterStatus
    return jobMatch && statusMatch
  })

  // ── Login Screen ──
  if (!authed) return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-white">Admin Access</h1>
          <p className="text-white/40 text-sm">Enter your admin secret to continue</p>
        </div>
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
          <input
            type="password"
            placeholder="Admin secret"
            value={secret}
            onChange={(e) => { setSecret(e.target.value); setAuthError("") }}
            onKeyDown={(e) => e.key === "Enter" && handleAuth()}
            className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 focus:border-orange-500/50 text-white text-sm outline-none transition-colors"
          />
          {authError && <p className="text-red-400 text-xs">{authError}</p>}
          <button
            onClick={handleAuth}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enter"}
          </button>
        </div>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-black text-white pb-32">
      <div className="max-w-6xl mx-auto px-4 pt-20 space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-8">
          <div>
            <h1 className="text-2xl font-bold">Careers Admin</h1>
            <p className="text-white/40 text-sm mt-1">
              {jobs.length} postings · {applications.length} applications
            </p>
          </div>
          <button
            onClick={() => setShowJobForm(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> New Opening
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white/5 rounded-xl w-fit">
          {(["jobs", "applications"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                tab === t ? "bg-orange-600 text-white" : "text-white/40 hover:text-white"
              }`}
            >
              {t === "jobs" ? <span className="flex items-center gap-2"><Briefcase className="w-3.5 h-3.5" />Jobs</span>
                : <span className="flex items-center gap-2"><Users className="w-3.5 h-3.5" />Applications</span>}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : tab === "jobs" ? (
          /* ── JOBS TAB ── */
          <div className="space-y-4">
            {jobs.length === 0 && (
              <p className="text-white/30 text-center py-16">No job postings yet. Create one above.</p>
            )}
            {jobs.map((job) => (
              <div key={job._id as string} className="rounded-2xl bg-white/[0.02] border border-white/10 overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${job.isOpen ? "bg-green-400" : "bg-white/20"}`} />
                      <span className="text-xs text-white/30 font-medium uppercase tracking-wider">{job.department}</span>
                    </div>
                    <h3 className="font-bold text-white">{job.title}</h3>
                    <p className="text-white/40 text-xs">{job.location} · {job.type} · {job.experience}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => toggleJob(job._id as string, job.isOpen)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        job.isOpen
                          ? "bg-green-600/10 border-green-500/30 text-green-400 hover:bg-red-600/10 hover:border-red-500/30 hover:text-red-400"
                          : "bg-white/5 border-white/10 text-white/40 hover:bg-green-600/10 hover:border-green-500/30 hover:text-green-400"
                      }`}
                    >
                      {job.isOpen ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                      {job.isOpen ? "Open" : "Closed"}
                    </button>
                    <button
                      onClick={() => setExpandedJob(expandedJob === job._id ? null : job._id as string)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all"
                    >
                      {expandedJob === job._id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      Details
                    </button>
                    <button
                      onClick={() => deleteJob(job._id as string)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-red-400/60 hover:text-red-400 hover:border-red-500/30 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {expandedJob === job._id && (
                  <div className="border-t border-white/10 p-5 space-y-4 text-sm text-white/50">
                    <p>{job.description}</p>
                    {job.responsibilities?.length > 0 && (
                      <div>
                        <p className="text-orange-500 font-semibold text-xs uppercase tracking-wider mb-2">Responsibilities</p>
                        <ul className="space-y-1 list-disc list-inside">{job.responsibilities.map((r, i) => <li key={i}>{r}</li>)}</ul>
                      </div>
                    )}
                    {job.requirements?.length > 0 && (
                      <div>
                        <p className="text-orange-500 font-semibold text-xs uppercase tracking-wider mb-2">Requirements</p>
                        <ul className="space-y-1 list-disc list-inside">{job.requirements.map((r, i) => <li key={i}>{r}</li>)}</ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* ── APPLICATIONS TAB ── */
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              <select
                value={filterJob}
                onChange={(e) => setFilterJob(e.target.value)}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none"
              >
                <option value="All">All Jobs</option>
                {jobs.map((j) => <option key={j._id as string} value={j._id as string}>{j.title}</option>)}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none"
              >
                {["All", "pending", "reviewing", "accepted", "rejected"].map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
              <span className="px-4 py-2 text-white/30 text-xs self-center">
                {filteredApps.length} result(s)
              </span>
            </div>

            {filteredApps.length === 0 && (
              <p className="text-white/30 text-center py-16">No applications match the filter.</p>
            )}

            {filteredApps.map((app) => (
              <div key={app._id as string} className="rounded-2xl bg-white/[0.02] border border-white/10 p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${STATUS_COLORS[app.status]}`}>
                        {app.status}
                      </span>
                      <span className="text-white/30 text-xs">{app.jobTitle}</span>
                    </div>
                    <h3 className="font-bold text-white text-lg">{app.fullName}</h3>
                    <p className="text-white/40 text-sm">{app.email} · {app.phone}</p>
                    <p className="text-white/30 text-xs">{app.degree} · {app.university} · {app.year}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap shrink-0">
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-orange-600/10 border border-orange-500/30 text-orange-400 hover:bg-orange-600/20 transition-all"
                    >
                      <FileText className="w-3.5 h-3.5" /> Resume
                    </a>
                    {app.linkedin && (
                      <a href={app.linkedin} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all">
                        <ExternalLink className="w-3.5 h-3.5" /> LinkedIn
                      </a>
                    )}
                    {app.portfolio && (
                      <a href={app.portfolio} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all">
                        <ExternalLink className="w-3.5 h-3.5" /> Portfolio
                      </a>
                    )}
                    <button
                      onClick={() => deleteApplication(app._id as string)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-red-400/60 hover:text-red-400 hover:border-red-500/30 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {app.coverLetter && (
                  <div className="border-t border-white/10 pt-4">
                    <p className="text-xs text-orange-500 font-semibold uppercase tracking-wider mb-2">Cover Letter</p>
                    <p className="text-white/50 text-sm leading-relaxed">{app.coverLetter}</p>
                  </div>
                )}

                <div className="border-t border-white/10 pt-4 flex flex-wrap gap-2">
                  {["pending", "reviewing", "accepted", "rejected"].map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(app._id as string, s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        app.status === s
                          ? STATUS_COLORS[s]
                          : "bg-white/5 border-white/10 text-white/30 hover:text-white"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── New Job Modal ── */}
      {showJobForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Post New Opening</h3>
              <button onClick={() => setShowJobForm(false)} className="text-white/40 hover:text-white"><X /></button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <MField label="Job Title *" value={jobForm.title} onChange={(v) => setJobForm((p) => ({ ...p, title: v }))} />
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-white/40 uppercase tracking-wider">Department *</label>
                  <select value={jobForm.department} onChange={(e) => setJobForm((p) => ({ ...p, department: e.target.value }))}
                    className="px-4 py-3 rounded-xl bg-black border border-white/10 text-white text-sm outline-none">
                    {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <MField label="Location *" value={jobForm.location} onChange={(v) => setJobForm((p) => ({ ...p, location: v }))} placeholder="e.g. Remote / Chennai" />
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-white/40 uppercase tracking-wider">Type *</label>
                  <select value={jobForm.type} onChange={(e) => setJobForm((p) => ({ ...p, type: e.target.value }))}
                    className="px-4 py-3 rounded-xl bg-black border border-white/10 text-white text-sm outline-none">
                    {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <MField label="Experience *" value={jobForm.experience} onChange={(v) => setJobForm((p) => ({ ...p, experience: v }))} placeholder="e.g. 0–2 years" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/40 uppercase tracking-wider">Description *</label>
                <textarea rows={3} value={jobForm.description} onChange={(e) => setJobForm((p) => ({ ...p, description: e.target.value }))}
                  className="px-4 py-3 rounded-xl bg-black border border-white/10 text-white text-sm outline-none resize-none" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/40 uppercase tracking-wider">Responsibilities (one per line)</label>
                <textarea rows={4} value={jobForm.responsibilities} onChange={(e) => setJobForm((p) => ({ ...p, responsibilities: e.target.value }))}
                  placeholder={"Design game mechanics\nWrite clean code\nCollaborate with team"}
                  className="px-4 py-3 rounded-xl bg-black border border-white/10 text-white text-sm outline-none resize-none placeholder:text-white/20" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/40 uppercase tracking-wider">Requirements (one per line)</label>
                <textarea rows={4} value={jobForm.requirements} onChange={(e) => setJobForm((p) => ({ ...p, requirements: e.target.value }))}
                  placeholder={"Proficiency in Unity\nStrong C# skills\nPortfolio required"}
                  className="px-4 py-3 rounded-xl bg-black border border-white/10 text-white text-sm outline-none resize-none placeholder:text-white/20" />
              </div>

              {jobFormError && <p className="text-red-400 text-sm">{jobFormError}</p>}
            </div>

            <div className="p-6 border-t border-white/5 flex justify-end gap-3">
              <button onClick={() => setShowJobForm(false)} className="px-6 py-2.5 bg-white/10 text-white rounded-xl text-sm">Cancel</button>
              <button onClick={handlePostJob} disabled={jobFormLoading}
                className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-sm flex items-center gap-2 transition-colors disabled:opacity-60">
                {jobFormLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post Job"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function MField({ label, value, onChange, placeholder = "" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-white/40 uppercase tracking-wider">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="px-4 py-3 rounded-xl bg-black border border-white/10 focus:border-orange-500/50 text-white text-sm outline-none transition-colors placeholder:text-white/20" />
    </div>
  )
}