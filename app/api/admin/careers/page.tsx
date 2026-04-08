"use client"

import { useEffect, useState } from "react"
import { Job, Application } from "@/lib/types"
import {
  Plus, X, Loader2, ChevronDown, ChevronUp,
  Briefcase, Users, ToggleLeft, ToggleRight,
  Trash2, ExternalLink, FileText,
  Calendar, Clock, Unlock, Link2, CheckCircle2
} from "lucide-react"

function inlineResumeUrl(url: string) {
  return `/api/resume?url=${encodeURIComponent(url)}`
}

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

// ─── Types ────────────────────────────────────────────────────────────────────

interface Slot {
  _id: string
  title: string
  date: string
  time: string
  duration: string
  link: string
  isBooked: boolean
  bookedBy: { name: string; email: string; bookedAt: string } | null
}

interface SlotForm {
  title: string
  date: string
  time: string
  duration: string
  link: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short", year: "numeric", month: "short", day: "numeric",
  })
}

function groupByDate(slots: Slot[]): Record<string, Slot[]> {
  return slots.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = []
    acc[slot.date].push(slot)
    return acc
  }, {} as Record<string, Slot[]>)
}

// ─── Slots Tab ────────────────────────────────────────────────────────────────

function SlotsTab({ secret }: { secret: string }) {
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set())
  const [copied, setCopied] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  const [form, setForm] = useState<SlotForm>({
    title: "", date: "", time: "", duration: "30 min", link: "",
  })
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [formError, setFormError] = useState("")

  const fetchSlots = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/slots")
      const data = await res.json()
      setSlots(data.slots || [])
      const dates = new Set<string>((data.slots || []).map((s: Slot) => s.date))
      setExpandedDates(dates)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSlots() }, [])

  const copyLink = () => {
    const link = `${window.location.origin}/slots`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCreate = async () => {
    if (!form.title || !form.date || !form.time || !form.duration) {
      setFormError("Please fill in all required fields.")
      setFormStatus("error")
      return
    }
    setFormStatus("loading")
    setFormError("")
    try {
      const res = await fetch("/api/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-secret": secret },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setFormStatus("success")
      setForm({ title: "", date: "", time: "", duration: "30 min", link: "" })
      setTimeout(() => { setFormStatus("idle"); setShowForm(false); fetchSlots() }, 800)
    } catch {
      setFormError("Failed to create slot.")
      setFormStatus("error")
    }
  }

  const handleUnbook = async (slotId: string) => {
    setActionLoadingId(slotId)
    try {
      await fetch(`/api/slots/${slotId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-secret": secret },
        body: JSON.stringify({ action: "unbook" }),
      })
      fetchSlots()
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleDelete = async (slotId: string) => {
    if (!confirm("Delete this slot permanently?")) return
    setActionLoadingId(slotId)
    try {
      await fetch(`/api/slots/${slotId}`, {
        method: "DELETE",
        headers: { "x-admin-secret": secret },
      })
      fetchSlots()
    } finally {
      setActionLoadingId(null)
    }
  }

  const toggleDate = (date: string) => {
    setExpandedDates((prev) => {
      const next = new Set(prev)
      next.has(date) ? next.delete(date) : next.add(date)
      return next
    })
  }

  const grouped = groupByDate(slots)
  const sortedDates = Object.keys(grouped).sort()
  const totalBooked = slots.filter((s) => s.isBooked).length

  return (
    <div className="space-y-6">

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-white font-bold text-lg">Interview Slots</h2>
          <p className="text-white/40 text-xs mt-0.5">
            {slots.length} total · {totalBooked} booked · {slots.length - totalBooked} available
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyLink}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white text-sm font-medium transition-all"
          >
            {copied
              ? <><CheckCircle2 className="w-4 h-4 text-green-400" /> Copied!</>
              : <><Link2 className="w-4 h-4" /> Copy Booking Link</>
            }
          </button>
          <button
            onClick={() => setShowForm((p) => !p)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold transition-colors"
          >
            {showForm ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Add Slot</>}
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-2">New Slot</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <label className="text-xs text-white/40 font-medium uppercase tracking-wider">
                Title / Role <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Unity Developer Interview"
                className="px-4 py-3 rounded-xl bg-black border border-white/10 focus:border-orange-500/50 text-white text-sm outline-none transition-colors placeholder:text-white/20"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/40 font-medium uppercase tracking-wider">
                Date <span className="text-orange-500">*</span>
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                className="px-4 py-3 rounded-xl bg-black border border-white/10 focus:border-orange-500/50 text-white text-sm outline-none transition-colors [color-scheme:dark]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/40 font-medium uppercase tracking-wider">
                Time <span className="text-orange-500">*</span>
              </label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
                className="px-4 py-3 rounded-xl bg-black border border-white/10 focus:border-orange-500/50 text-white text-sm outline-none transition-colors [color-scheme:dark]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/40 font-medium uppercase tracking-wider">
                Duration <span className="text-orange-500">*</span>
              </label>
              <select
                value={form.duration}
                onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))}
                className="px-4 py-3 rounded-xl bg-black border border-white/10 focus:border-orange-500/50 text-white text-sm outline-none transition-colors"
              >
                <option>15 min</option>
                <option>30 min</option>
                <option>45 min</option>
                <option>60 min</option>
                <option>90 min</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/40 font-medium uppercase tracking-wider">Meeting Link </label>
              <input
                type="text"
                value={form.link}
                onChange={(e) => setForm((p) => ({ ...p, link: e.target.value }))}
                placeholder="e.g. https://meet.google.com/..."
                className="px-4 py-3 rounded-xl bg-black border border-white/10 focus:border-orange-500/50 text-white text-sm outline-none transition-colors placeholder:text-white/20"
              />
            </div>
          </div>

          {formStatus === "error" && <p className="text-red-400 text-sm">{formError}</p>}

          <div className="flex justify-end pt-2">
            <button
              onClick={handleCreate}
              disabled={formStatus === "loading" || formStatus === "success"}
              className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm flex items-center gap-2 transition-colors disabled:opacity-60"
            >
              {formStatus === "loading" ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</>
                : formStatus === "success" ? <><CheckCircle2 className="w-4 h-4 text-green-300" /> Created!</>
                : <><Plus className="w-4 h-4" /> Create Slot</>}
            </button>
          </div>
        </div>
      )}

      {/* Slots List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-7 h-7 animate-spin text-orange-500" />
        </div>
      ) : slots.length === 0 ? (
        <div className="text-center py-20 text-white/25">
          <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No slots yet</p>
          <p className="text-sm mt-1">Add your first slot above.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <div key={date} className="bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleDate(date)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-orange-500" />
                  <span className="text-white font-bold text-sm">{formatDate(date)}</span>
                  <span className="text-white/30 text-xs">
                    {grouped[date].filter((s) => !s.isBooked).length} available
                    · {grouped[date].filter((s) => s.isBooked).length} booked
                  </span>
                </div>
                {expandedDates.has(date)
                  ? <ChevronUp className="w-4 h-4 text-white/30" />
                  : <ChevronDown className="w-4 h-4 text-white/30" />}
              </button>

              {expandedDates.has(date) && (
                <div className="border-t border-white/5 divide-y divide-white/5">
                  {grouped[date].map((slot) => (
                    <div key={slot._id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-white font-semibold text-sm">{slot.title}</span>
                          {slot.isBooked ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/30 uppercase tracking-wider">
                              Booked
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-600/15 border border-green-500/30 text-green-400 uppercase tracking-wider">
                              Available
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs text-white/40">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3" />{slot.time} · {slot.duration}
                          </span>
                          {slot.link && <span className="italic text-white/25">{slot.link}</span>}
                        </div>
                        {slot.isBooked && slot.bookedBy && (
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <Users className="w-3 h-3 text-orange-400 shrink-0" />
                            <span className="text-xs text-orange-300 font-medium">{slot.bookedBy.name}</span>
                            <span className="text-xs text-white/30">{slot.bookedBy.email}</span>
                            <span className="text-xs text-white/20">
                              · booked {new Date(slot.bookedBy.bookedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {slot.isBooked && (
                          <button
                            onClick={() => handleUnbook(slot._id)}
                            disabled={actionLoadingId === slot._id}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white text-xs font-medium transition-all disabled:opacity-40"
                          >
                            {actionLoadingId === slot._id
                              ? <Loader2 className="w-3 h-3 animate-spin" />
                              : <Unlock className="w-3 h-3" />}
                            Unbook
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(slot._id)}
                          disabled={actionLoadingId === slot._id}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 text-red-400/60 hover:text-red-400 text-xs font-medium transition-all disabled:opacity-40"
                        >
                          {actionLoadingId === slot._id
                            ? <Loader2 className="w-3 h-3 animate-spin" />
                            : <Trash2 className="w-3 h-3" />}
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

export default function AdminCareersPage() {
  const [secret, setSecret] = useState("")
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState("")

  const [tab, setTab] = useState<"jobs" | "applications" | "slots">("jobs")
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

  const handleAuth = async () => {
    if (!secret.trim()) { setAuthError("Please enter the admin secret."); return }
    setLoading(true)
    setAuthError("")
    try {
      const res = await fetch("/api/jobs", { headers: { "x-admin-secret": secret } })
      if (res.ok) { setAuthed(true); fetchAll() }
      else setAuthError("Invalid secret. Try again.")
    } catch {
      setAuthError("Something went wrong. Try again.")
    } finally {
      setLoading(false)
    }
  }

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

  const handlePostJob = async () => {
    if (!jobForm.title || !jobForm.location || !jobForm.experience || !jobForm.description) {
      setJobFormError("Please fill all required fields."); return
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
    if (res.ok) { setShowJobForm(false); setJobForm(BLANK_JOB); fetchAll() }
    else setJobFormError("Failed to post job.")
    setJobFormLoading(false)
  }

  const toggleJob = async (jobId: string, isOpen: boolean) => {
    await fetch(`/api/jobs/${jobId}`, { method: "PATCH", headers, body: JSON.stringify({ isOpen: !isOpen }) })
    fetchAll()
  }

  const deleteJob = async (jobId: string) => {
    if (!confirm("Delete this job posting?")) return
    await fetch(`/api/jobs/${jobId}`, { method: "DELETE", headers })
    fetchAll()
  }

  const updateStatus = async (applicationId: string, status: string) => {
    await fetch("/api/admin/applications", { method: "PATCH", headers, body: JSON.stringify({ applicationId, status }) })
    fetchAll()
  }

  const deleteApplication = async (applicationId: string) => {
    if (!confirm("Delete this application?")) return
    await fetch("/api/admin/applications", { method: "DELETE", headers, body: JSON.stringify({ applicationId }) })
    fetchAll()
  }

  const filteredApps = applications.filter((a) => {
    const jobMatch = filterJob === "All" || a.jobId === filterJob
    const statusMatch = filterStatus === "All" || a.status === filterStatus
    return jobMatch && statusMatch
  })

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
          {tab !== "slots" && (
            <button
              onClick={() => setShowJobForm(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm transition-colors"
            >
              <Plus className="w-4 h-4" /> New Opening
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white/5 rounded-xl w-fit">
          {(["jobs", "applications", "slots"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                tab === t ? "bg-orange-600 text-white" : "text-white/40 hover:text-white"
              }`}
            >
              {t === "jobs" && <span className="flex items-center gap-2"><Briefcase className="w-3.5 h-3.5" />Jobs</span>}
              {t === "applications" && <span className="flex items-center gap-2"><Users className="w-3.5 h-3.5" />Applications</span>}
              {t === "slots" && <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" />Slots</span>}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === "slots" ? (
          <SlotsTab secret={secret} />
        ) : loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : tab === "jobs" ? (
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
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              <select value={filterJob} onChange={(e) => setFilterJob(e.target.value)}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none">
                <option value="All">All Jobs</option>
                {jobs.map((j) => <option key={j._id as string} value={j._id as string}>{j.title}</option>)}
              </select>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none">
                {["All", "pending", "reviewing", "accepted", "rejected"].map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
              <span className="px-4 py-2 text-white/30 text-xs self-center">{filteredApps.length} result(s)</span>
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
                    <a href={inlineResumeUrl(app.resumeUrl)} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-orange-600/10 border border-orange-500/30 text-orange-400 hover:bg-orange-600/20 transition-all">
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
                    <button onClick={() => deleteApplication(app._id as string)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-red-400/60 hover:text-red-400 hover:border-red-500/30 transition-all">
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
                    <button key={s} onClick={() => updateStatus(app._id as string, s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        app.status === s ? STATUS_COLORS[s] : "bg-white/5 border-white/10 text-white/30 hover:text-white"
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Job Modal */}
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