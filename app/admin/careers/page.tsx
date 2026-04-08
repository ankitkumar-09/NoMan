"use client"

import { useEffect, useState, useRef } from "react"
import {
  Plus, X, Loader2, ChevronDown, ChevronUp,
  Briefcase, Users, ToggleLeft, ToggleRight,
  Trash2, ExternalLink, FileText,
  Calendar, Clock, Unlock, Link2, CheckCircle2,
  Download, Mail, Copy, Check, Lock, Upload
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Application {
  _id: string
  fullName: string
  email: string
  phone: string
  degree: string
  university: string
  year?: string
  linkedin?: string
  portfolio?: string
  jobId: string
  jobTitle: string
  coverLetter?: string
  resumeUrl: string
  status: "pending" | "reviewing" | "accepted" | "rejected"
  inviteSent?: boolean
  inviteSentAt?: string
  createdAt: string
}

interface Job {
  _id: string
  title: string
  department: string
  location: string
  type: string
  experience: string
  description: string
  responsibilities: string[]
  requirements: string[]
  isOpen: boolean
}

interface Slot {
  _id: string
  title: string
  date: string
  time: string
  duration: string
  link: string
  note?: string
  isBooked: boolean
  bookedBy: { name: string; email: string; bookedAt: string } | null
}

// ─── Constants & Helpers ──────────────────────────────────────────────────────

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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  })
}

function formatSlotDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short", year: "numeric", month: "short", day: "numeric",
  })
}

function inlineResumeUrl(url: string) {
  return `/api/resume?url=${encodeURIComponent(url)}`
}

function exportAcceptedCSV(applications: Application[]) {
  const accepted = applications.filter((a) => a.status === "accepted")
  if (accepted.length === 0) {
    alert("No accepted applicants to export.")
    return
  }

  const headers = ["Full Name", "Email", "Phone", "Degree", "University", "Job Title", "Applied On", "Invite Sent"]
  const rows = accepted.map((a) => [
    a.fullName, a.email, a.phone || "", a.degree || "", a.university || "", 
    a.jobTitle, formatDate(a.createdAt), a.inviteSent ? "Yes" : "No"
  ])
  

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `nomangames-applicants.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ─── Component: Slots Tab ─────────────────────────────────────────────────────

function SlotsTab({ secret }: { secret: string }) {
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  const [form, setForm] = useState({
    title: "", date: "", time: "", duration: "30 min", link: "", note: ""
  })

  const fetchSlots = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/slots")
      const data = await res.json()
      setSlots(data.slots || [])
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchSlots() }, [])

  const handleCreate = async () => {
    if (!form.title || !form.date || !form.time || !form.link) {
      return alert("Title, Date, Time, and Meeting Link are all required.")
    }

    try {
      const res = await fetch("/api/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-secret": secret },
        body: JSON.stringify(form),
      })
      
      if (res.ok) {
        setShowForm(false)
        setForm({ title: "", date: "", time: "", duration: "30 min", link: "", note: "" })
        fetchSlots()
      } else {
        const errorData = await res.json()
        alert(`Server Error: ${errorData.message || errorData.error}`)
      }
    } catch (err) { alert("Network error. Failed to create slot.") }
  }

  const handleUnbook = async (id: string) => {
    if (!confirm("Unbook this slot?")) return
    setActionLoadingId(id)
    await fetch(`/api/slots/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-secret": secret },
      body: JSON.stringify({ action: "unbook" }),
    })
    fetchSlots()
    setActionLoadingId(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete slot permanently?")) return
    setActionLoadingId(id)
    await fetch(`/api/slots/${id}`, {
      method: "DELETE",
      headers: { "x-admin-secret": secret },
    })
    fetchSlots()
    setActionLoadingId(null)
  }

  const grouped = slots.reduce((acc, s) => {
    if (!acc[s.date]) acc[s.date] = []
    acc[s.date].push(s)
    return acc
  }, {} as Record<string, Slot[]>)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-white font-bold text-lg">Interview Slots</h2>
          <p className="text-white/40 text-xs">Manage scheduling and booked candidates</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-orange-600 rounded-xl text-sm font-bold">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />} {showForm ? "Cancel" : "Add Slot"}
        </button>
      </div>

      {showForm && (
        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 shadow-2xl">
          <div className="sm:col-span-2">
            <label className="text-[10px] text-white/40 uppercase font-bold mb-1 block tracking-widest">Slot Title / Role *</label>
            <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-black border border-white/10 p-3 rounded-xl text-white outline-none" placeholder="e.g. Gameplay Programmer Interview" />
          </div>
          <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="bg-black border border-white/10 p-3 rounded-xl text-white outline-none [color-scheme:dark]" />
          <input type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="bg-black border border-white/10 p-3 rounded-xl text-white outline-none [color-scheme:dark]" />
          <select value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="bg-black border border-white/10 p-3 rounded-xl text-white outline-none">
            <option>15 min</option><option>30 min</option><option>45 min</option><option>60 min</option>
          </select>
          <input type="text" value={form.link} onChange={e => setForm({...form, link: e.target.value})} className="bg-black border border-white/10 p-3 rounded-xl text-white outline-none" placeholder="Meeting Link *" />
          <div className="sm:col-span-2">
            <input type="text" value={form.note} onChange={e => setForm({...form, note: e.target.value})} className="w-full bg-black border border-white/10 p-3 rounded-xl text-white outline-none" placeholder="Note (Optional)" />
          </div>
          <div className="sm:col-span-2 flex justify-end pt-2">
            <button onClick={handleCreate} className="px-10 py-3 bg-orange-600 rounded-xl font-bold">Create Slot</button>
          </div>
        </div>
      )}

      {loading ? <Loader2 className="animate-spin mx-auto text-orange-500 mt-10" /> : (
        <div className="space-y-8">
          {Object.keys(grouped).sort().map(date => (
            <div key={date}>
              <div className="text-[11px] font-bold text-orange-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                <span className="shrink-0">{formatSlotDate(date)}</span>
                <div className="h-px w-full bg-white/10" />
              </div>
              <div className="grid gap-3">
                {grouped[date].map(slot => (
                  <div key={slot._id} className="bg-white/[0.02] border border-white/10 p-5 rounded-2xl flex flex-col sm:flex-row justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white">{slot.title}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-widest ${slot.isBooked ? "bg-orange-500/10 text-orange-400 border-orange-500/20" : "bg-green-500/10 text-green-400 border-green-500/20"}`}>
                          {slot.isBooked ? "Booked" : "Available"}
                        </span>
                      </div>
                      <p className="text-white/40 text-[11px]">{slot.time} · {slot.duration} {slot.note && `· ${slot.note}`}</p>
                      {slot.isBooked && slot.bookedBy && (
                        <div className="mt-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                          <p className="text-white font-bold text-xs">{slot.bookedBy.name}</p>
                          <p className="text-white/30 text-[10px]">{slot.bookedBy.email}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 self-start shrink-0">
                      {slot.isBooked && (
                        <button onClick={() => handleUnbook(slot._id)} disabled={actionLoadingId === slot._id} className="p-2.5 bg-white/5 rounded-xl text-white/40 hover:text-white border border-white/10 transition-all"><Unlock className="w-4 h-4" /></button>
                      )}
                      <button onClick={() => handleDelete(slot._id)} disabled={actionLoadingId === slot._id} className="p-2.5 bg-red-500/10 rounded-xl text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

export default function AdminCareersPage() {
    const [isBulkInviting, setIsBulkInviting] = useState(false)
const [inviteLogs, setInviteLogs] = useState<{ email: string; status: 'waiting' | 'sending' | 'success' | 'error' }[]>([])
const [totalToInvite, setTotalToInvite] = useState(0)
  const [secret, setSecret] = useState("")
  const [authed, setAuthed] = useState(false)
  const [tab, setTab] = useState<"jobs" | "applications" | "slots">("jobs")
  const [jobs, setJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(false)
  const [inviteLoading, setInviteLoading] = useState<string | null>(null)

  const [showJobForm, setShowJobForm] = useState(false)
  const [jobForm, setJobForm] = useState(BLANK_JOB)
  const [expandedJob, setExpandedJob] = useState<string | null>(null)
  const [filterJob, setFilterJob] = useState("All")
  const [filterStatus, setFilterStatus] = useState("All")

  const fileInputRef = useRef<HTMLInputElement>(null)
  const headers = { "x-admin-secret": secret, "Content-Type": "application/json" }

  const handleAuth = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/jobs", { headers: { "x-admin-secret": secret } })
      if (res.ok) { setAuthed(true); fetchAll() }
      else alert("Unauthorized Secret Key")
    } finally { setLoading(false) }
  }
const handlePostJob = async () => {
    setLoading(true)
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
    }
    setLoading(false)
  }
  const fetchAll = async () => {
    setLoading(true)
    try {
      const [jobsRes, appsRes] = await Promise.all([
        fetch("/api/jobs", { headers }),
        fetch("/api/admin/applications", { headers }),
      ])
      const jData = await jobsRes.json()
      const aData = await appsRes.json()
      setJobs(jData.jobs || [])
      setApplications(aData.applications || [])
    } finally { setLoading(false) }
  }

  const handleBulkInvite = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = async (event) => {
    const csvData = event.target?.result as string

    const rows = csvData
      .split("\n")
      .map(r => r.trim())
      .filter(r => r.length > 0)

    // Skip header
   const emails = rows.slice(1).map(r => {
  const cleanRow = r.replace(/"/g, "").trim()
  const [email] = cleanRow.split(",") 
  return email.toLowerCase().trim()
})
  console.log("Parsed emails:", emails)

    alert(`Found ${emails.length} emails`)

    for (const email of emails) {
      const cleanEmail = email.toLowerCase().trim()

      const applicant = applications.find(
        a => a.email.toLowerCase().trim() === cleanEmail
      )

      if (!applicant) {
        console.log("❌ Not found:", cleanEmail)
        continue
      }

      if (applicant.status !== "accepted") {
        console.log("⚠ Not accepted:", cleanEmail)
        continue
      }

      await fetch("/api/admin/invite", {
        method: "POST",
        headers,
        body: JSON.stringify({ applicationId: applicant._id })
      })

      console.log("✅ Invited:", cleanEmail)
    }

    alert("Bulk invite finished")
    fetchAll()
  }

  reader.readAsText(file)
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const handleInviteAllAccepted = async () => {
  const accepted = applications.filter(a => a.status === "accepted" && !a.inviteSent)

  if (accepted.length === 0) {
    alert("No pending accepted applicants to invite.")
    return
  }

  // Initialize logs
  setInviteLogs(accepted.map(a => ({ email: a.email, status: 'waiting' })))
  setTotalToInvite(accepted.length)
  setIsBulkInviting(true)

  for (let i = 0; i < accepted.length; i++) {
    const applicant = accepted[i];
    
    // Update status to 'sending'
    setInviteLogs(prev => prev.map((log, idx) => idx === i ? { ...log, status: 'sending' } : log))

    try {
      const res = await fetch("/api/admin/invite", {
        method: "POST",
        headers,
        body: JSON.stringify({ applicationId: applicant._id })
      })

      if (res.ok) {
        setInviteLogs(prev => prev.map((log, idx) => idx === i ? { ...log, status: 'success' } : log))
      } else {
        setInviteLogs(prev => prev.map((log, idx) => idx === i ? { ...log, status: 'error' } : log))
      }
    } catch (err) {
      setInviteLogs(prev => prev.map((log, idx) => idx === i ? { ...log, status: 'error' } : log))
    }

    // Wait 2 seconds before the next one (except for the last one)
    if (i < accepted.length - 1) {
      await sleep(2000)
    }
  }

  // Refresh data once done
  fetchAll()
}
  const handleSendInvite = async (id: string) => {
    setInviteLoading(id)
    try {
      const res = await fetch("/api/admin/invite", { method: "POST", headers, body: JSON.stringify({ applicationId: id }) })
      if (res.ok) { fetchAll(); alert("Invite sent!") }
    } finally { setInviteLoading(null) }
  }

  const updateStatus = async (applicationId: string, status: string) => {
    await fetch("/api/admin/applications", { method: "PATCH", headers, body: JSON.stringify({ applicationId, status }) })
    fetchAll()
  }

  const toggleJob = async (id: string, current: boolean) => {
    await fetch(`/api/jobs/${id}`, { method: "PATCH", headers, body: JSON.stringify({ isOpen: !current }) })
    fetchAll()
  }

  const deleteJob = async (id: string) => {
    if (!confirm("Delete this listing?")) return
    await fetch(`/api/jobs/${id}`, { method: "DELETE", headers })
    fetchAll()
  }

  const filteredApps = applications.filter((a) => {
    const jobMatch = filterJob === "All" || a.jobId === filterJob
    const statusMatch = filterStatus === "All" || a.status === filterStatus
    return jobMatch && statusMatch
  })

  if (!authed) return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 space-y-6">
        <h1 className="text-2xl font-bold text-center">Admin Login</h1>
        <input type="password" placeholder="Secret Key" value={secret} onChange={(e) => setSecret(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAuth()} className="w-full px-4 py-4 rounded-2xl bg-black border border-white/10 text-white outline-none focus:border-orange-500/50 transition-all text-center tracking-widest" />
        <button onClick={handleAuth} className="w-full py-4 bg-orange-600 hover:bg-orange-500 rounded-2xl font-bold">{loading ? <Loader2 className="animate-spin mx-auto w-5 h-5" /> : "Authorize"}</button>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-black text-white pb-32">
      <div className="max-w-6xl mx-auto px-4 pt-20 space-y-8">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-10">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-white/40 text-sm mt-1">{jobs.length} roles · {applications.length} applications</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => exportAcceptedCSV(applications)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-all">
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button
  onClick={handleInviteAllAccepted}
  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600/10 border border-green-500/30 text-green-400 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-all"
>
  Send All Invites
</button>
            <button onClick={() => setShowJobForm(true)} className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all">Post Role</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white/5 border border-white/5 rounded-2xl w-fit">
          {(["jobs", "applications", "slots"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${tab === t ? "bg-orange-600 text-white" : "text-white/30 hover:text-white"}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Applications Tab */}
        {tab === "applications" && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <select value={filterJob} onChange={(e) => setFilterJob(e.target.value)} className="bg-white/5 border border-white/10 p-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider outline-none">
                <option value="All">All Jobs</option>
                {jobs.map(j => <option key={j._id} value={j._id}>{j.title}</option>)}
              </select>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-white/5 border border-white/10 p-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider outline-none">
                {["All", "pending", "reviewing", "accepted", "rejected"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="grid gap-3">
              {filteredApps.map(app => (
                <div key={app._id} className="bg-white/[0.02] border border-white/10 rounded-3xl p-6">
                  <div className="flex flex-col sm:flex-row justify-between gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[9px] font-bold px-3 py-1 rounded-full border uppercase tracking-widest ${STATUS_COLORS[app.status]}`}>{app.status}</span>
                        {app.inviteSent && <span className="text-[9px] font-bold px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 uppercase tracking-widest">Sent</span>}
                        <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">{app.jobTitle}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white">{app.fullName}</h3>
                      <p className="text-white/40 text-sm">{app.email}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0 self-start">
                      <a href={inlineResumeUrl(app.resumeUrl)} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-orange-600/10 border border-orange-500/20 text-orange-400 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-orange-600/20 transition-all"><FileText className="w-3.5 h-3.5"/> Resume</a>
                      {app.status === "accepted" && (
                        <button onClick={() => handleSendInvite(app._id)} disabled={inviteLoading === app._id} className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-orange-600/10">
                          {inviteLoading === app._id ? <Loader2 className="animate-spin w-4 h-4"/> : <Mail className="w-4 h-4"/>} Invite
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/5 flex flex-wrap gap-2">
                    {["pending", "reviewing", "accepted", "rejected"].map(s => (
                      <button key={s} onClick={() => updateStatus(app._id, s)} className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest border transition-all ${app.status === s ? STATUS_COLORS[s] : "bg-white/5 border-white/10 text-white/30 hover:text-white"}`}>{s}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "jobs" && (
          <div className="space-y-4">
            {jobs.map(job => (
              <div key={job._id} className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">{job.department}</p>
                  <h3 className="text-lg font-bold text-white">{job.title}</h3>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleJob(job._id, job.isOpen)} className={`p-2.5 rounded-xl border transition-all ${job.isOpen ? "bg-green-600/10 border-green-500/20 text-green-400" : "bg-white/5 border-white/10 text-white/20"}`}>
                    {job.isOpen ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  </button>
                  <button onClick={() => deleteJob(job._id)} className="p-2.5 bg-white/5 hover:bg-red-600/10 rounded-xl text-white/20 hover:text-red-400 border border-white/5 hover:border-red-500/20 transition-all"><Trash2 className="w-5 h-5"/></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "slots" && <SlotsTab secret={secret} />}
      </div>

      {/* New Job Modal */}
      {showJobForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-white/10 w-full max-w-2xl rounded-[2rem] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-bold">New Role</h3>
              <button onClick={() => setShowJobForm(false)} className="p-2 text-white/30 hover:text-white"><X /></button>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <MField label="Job Title" value={jobForm.title} onChange={v => setJobForm({...jobForm, title: v})} />
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-white/40 uppercase font-bold px-1">Department</label>
                  <select value={jobForm.department} onChange={e => setJobForm({...jobForm, department: e.target.value})} className="bg-black border border-white/10 p-3.5 rounded-2xl text-sm outline-none">
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <MField label="Location" value={jobForm.location} onChange={v => setJobForm({...jobForm, location: v})} />
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-white/40 uppercase font-bold px-1">Type</label>
                  <select value={jobForm.type} onChange={e => setJobForm({...jobForm, type: e.target.value})} className="bg-black border border-white/10 p-3.5 rounded-2xl text-sm outline-none">
                    {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <MField label="Experience Required" value={jobForm.experience} onChange={v => setJobForm({...jobForm, experience: v})} />
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 uppercase font-bold px-1">Description</label>
                <textarea rows={3} value={jobForm.description} onChange={e => setJobForm({...jobForm, description: e.target.value})} className="bg-black border border-white/10 p-4 rounded-2xl text-sm outline-none resize-none" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 uppercase font-bold px-1">Responsibilities (One per line)</label>
                <textarea rows={4} value={jobForm.responsibilities} onChange={e => setJobForm({...jobForm, responsibilities: e.target.value})} className="bg-black border border-white/10 p-4 rounded-2xl text-sm outline-none resize-none" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 uppercase font-bold px-1">Requirements (One per line)</label>
                <textarea rows={4} value={jobForm.requirements} onChange={e => setJobForm({...jobForm, requirements: e.target.value})} className="bg-black border border-white/10 p-4 rounded-2xl text-sm outline-none resize-none" />
              </div>
            </div>
            <div className="p-8 border-t border-white/5 flex justify-end gap-3">
              <button onClick={() => setShowJobForm(false)} className="px-6 py-3 bg-white/5 rounded-2xl font-bold text-sm">Cancel</button>
              <button onClick={handlePostJob} className="px-10 py-3 bg-orange-600 rounded-2xl font-bold text-sm">Post Role</button>
            </div>
          </div>
        </div>
      )}
      {isBulkInviting && (
  <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
    <div className="bg-neutral-900 border border-white/10 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl">
      <div className="p-8 border-b border-white/5 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold">Sending Invites</h3>
          <p className="text-white/40 text-xs mt-1">Processing {totalToInvite} candidates...</p>
        </div>
        <button onClick={() => setIsBulkInviting(false)} className="p-2 text-white/30 hover:text-white"><X /></button>
      </div>
      <div className="p-6 max-h-[400px] overflow-y-auto space-y-3">
        {inviteLogs.map((log, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-3">
              <Mail className={`w-4 h-4 ${log.status === 'sending' ? 'text-orange-500 animate-pulse' : 'text-white/20'}`} />
              <span className="text-sm text-white/80">{log.email}</span>
            </div>
            {log.status === 'waiting' && <Clock className="w-4 h-4 text-white/20" />}
            {log.status === 'sending' && <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />}
            {log.status === 'success' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
            {log.status === 'error' && <X className="w-4 h-4 text-red-500" />}
          </div>
        ))}
      </div>
      <div className="p-8 border-t border-white/5">
        <button onClick={() => setIsBulkInviting(false)} className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-bold text-sm">
          {inviteLogs.every(l => l.status === 'success' || l.status === 'error') ? "Done" : "Close"}
        </button>
      </div>
    </div>
  </div>
)}
    </main>
  )
}

function MField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] text-white/40 uppercase font-bold px-1">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="px-4 py-3.5 rounded-2xl bg-black border border-white/10 focus:border-orange-500/50 text-white text-sm outline-none transition-all" />
    </div>
  )
}