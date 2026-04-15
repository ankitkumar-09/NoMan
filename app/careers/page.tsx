"use client"

import { useEffect, useState } from "react"
import { Job } from "@/lib/types"
import { Briefcase, MapPin, Clock, ChevronRight, Loader2, Rocket } from "lucide-react"
import Link from "next/link"

const TYPE_COLORS: Record<string, string> = {
  "Full-Time": "bg-orange-600/15 text-orange-400 border-orange-500/30",
  "Part-Time": "bg-blue-600/15 text-blue-400 border-blue-500/30",
  Internship: "bg-green-600/15 text-green-400 border-green-500/30",
  Contract: "bg-purple-600/15 text-purple-400 border-purple-500/30",
}

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [department, setDepartment] = useState("All")

  useEffect(() => {
    fetch("/api/jobs")
      .then((r) => r.json())
      .then((d) => setJobs(d.jobs || []))
      .finally(() => setLoading(false))
  }, [])

  const departments = ["All", ...Array.from(new Set(jobs.map((j) => j.department)))]
  const filtered = department === "All" ? jobs : jobs.filter((j) => j.department === department)

  return (
    <main className="min-h-screen bg-black text-white">

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(234,88,12,0.12)_0%,_transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_60%,black)] pointer-events-none" />

        <span className="inline-flex items-center gap-2 bg-orange-600/15 border border-orange-500/30 text-orange-400 text-[11px] font-semibold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full mb-6">
          <Rocket className="w-3 h-3" />
          We&apos;re Hiring
        </span>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 relative z-10">
          Build Games.<br />
          <span className="text-orange-500">Shape Stories.</span>
        </h1>
        <p className="text-white/50 text-sm sm:text-base max-w-xl mx-auto relative z-10">
          Join NoMan Studios and help us craft world-class gaming experiences. We&apos;re a small team with big ambitions.
        </p>
      </section>

      {/* Department Filter */}
      <section className="px-4 pb-10 max-w-6xl mx-auto">
        <div className="flex gap-2 flex-wrap justify-center">
          {departments.map((d) => (
            <button
              key={d}
              onClick={() => setDepartment(d)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                department === d
                  ? "bg-orange-600 border-orange-600 text-white"
                  : "bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/20"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </section>

      {/* Job Listings - GRID CARD LAYOUT */}
      <section className="px-4 pb-32 max-w-6xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-white/30">
            <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No openings right now</p>
            <p className="text-sm mt-1">Check back soon or subscribe to our newsletter.</p>
          </div>
        ) : (
          /* Grid settings changed to 3 columns on desktop */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((job) => (
              <Link
                key={job._id as string}
                href={`/careers/${job._id}`}
                className="group flex flex-col justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-orange-500/40 hover:bg-white/[0.04] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${TYPE_COLORS[job.type]}`}>
                      {job.type}
                    </span>
                    <span className="text-[10px] text-white/30 font-medium uppercase tracking-wider">
                      {job.department}
                    </span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors mb-4">
                    {job.title}
                  </h2>
                  
              <div className="flex flex-col gap-2 text-white/40 text-xs mb-8">
  <div className="flex items-center gap-2">
    <span className="font-medium text-white/70">Location:</span>
    <span>{job.location}</span>
  </div>

  <div className="flex items-center gap-2">
    <span className="font-medium text-white/70">Experience:</span>
    <span>{job.experience}</span>
  </div>
</div>
                </div>

                <div className="flex items-center justify-between text-orange-500 text-xs font-semibold border-t border-white/5 pt-4">
                  Apply Now
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}