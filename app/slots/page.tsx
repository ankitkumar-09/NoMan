"use client"

import { useEffect, useState } from "react"
import { Calendar, Clock, CheckCircle2, Loader2, Lock, ChevronRight } from "lucide-react"

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

interface BookingForm {
  name: string
  email: string
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function groupByDate(slots: Slot[]): Record<string, Slot[]> {
  return slots.reduce(
    (acc, slot) => {
      if (!acc[slot.date]) acc[slot.date] = []
      acc[slot.date].push(slot)
      return acc
    },
    {} as Record<string, Slot[]>
  )
}

export default function SlotsPage() {
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [form, setForm] = useState<BookingForm>({ name: "", email: "" })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    fetch("/api/slots")
      .then((r) => r.json())
      .then((d) => setSlots(d.slots || []))
      .finally(() => setLoading(false))
  }, [])

  const handleBook = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      setErrorMsg("Please fill in all fields.")
      setStatus("error")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErrorMsg("Please enter a valid email.")
      setStatus("error")
      return
    }

    setStatus("loading")
    setErrorMsg("")

    try {
      const res = await fetch(`/api/slots/${selectedSlot!._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name.trim(), email: form.email.trim() }),
      })

      const data = await res.json()

      if (res.status === 409) {
        setErrorMsg(data.error || "This slot is already booked.")
        setStatus("error")
        return
      }

      if (!res.ok) throw new Error()

      // Update local state
      setSlots((prev) =>
        prev.map((s) =>
          s._id === selectedSlot!._id
            ? {
                ...s,
                isBooked: true,
                bookedBy: {
                  name: form.name,
                  email: form.email,
                  bookedAt: new Date().toISOString(),
                },
              }
            : s
        )
      )
      setStatus("success")
    } catch {
      setErrorMsg("Something went wrong. Please try again.")
      setStatus("error")
    }
  }

  const resetModal = () => {
    setSelectedSlot(null)
    setForm({ name: "", email: "" })
    setStatus("idle")
    setErrorMsg("")
  }

  const grouped = groupByDate(slots.filter((s) => !s.isBooked || s.isBooked))
  const sortedDates = Object.keys(grouped).sort()

  return (
    <main className="min-h-screen bg-black text-white">

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(234,88,12,0.12)_0%,_transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_60%,black)] pointer-events-none" />

        <span className="inline-flex items-center gap-2 bg-orange-600/15 border border-orange-500/30 text-orange-400 text-[11px] font-semibold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full mb-6">
          <Calendar className="w-3 h-3" />
          Interview Slots
        </span>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 relative z-10">
          Book Your <span className="text-orange-500">Interview Slot</span>
        </h1>
        <p className="text-white/50 text-sm sm:text-base max-w-xl mx-auto relative z-10">
          Select an available slot below. Once booked, you'll receive a confirmation
          email with further details.
        </p>
      </section>

      {/* Slots */}
      <section className="px-4 pb-32 max-w-3xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : slots.length === 0 ? (
          <div className="text-center py-24 text-white/30">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No slots available right now</p>
            <p className="text-sm mt-1">Check back soon.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {sortedDates.map((date) => (
              <div key={date}>
                {/* Date Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500 px-2">
                    {formatDate(date)}
                  </span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                {/* Slots for this date */}
                <div className="grid gap-3">
                  {grouped[date].map((slot) => (
                    <div
                      key={slot._id}
                      onClick={() => !slot.isBooked && setSelectedSlot(slot)}
                      className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border transition-all ${
                        slot.isBooked
                          ? "bg-white/[0.01] border-white/5 opacity-50 cursor-not-allowed"
                          : "bg-white/[0.02] border-white/10 hover:border-orange-500/40 hover:bg-white/[0.04] cursor-pointer"
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          {slot.isBooked ? (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 rounded-full border bg-white/5 border-white/10 text-white/30">
                              <Lock className="w-2.5 h-2.5" /> Booked
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 rounded-full border bg-green-600/15 border-green-500/30 text-green-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                              Available
                            </span>
                          )}
                        </div>

                        <h3 className={`font-bold text-base ${slot.isBooked ? "text-white/30" : "text-white group-hover:text-orange-400 transition-colors"}`}>
                          {slot.title}
                        </h3>

                        <div className="flex flex-wrap gap-4 text-xs text-white/40">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3" />
                            {slot.time}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" />
                            {slot.duration}
                          </span>
                        
                        </div>
                      </div>

                      {!slot.isBooked && (
                        <div className="flex items-center gap-2 text-orange-500 text-sm font-semibold shrink-0">
                          Book Slot
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Booking Modal */}
      {selectedSlot && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-white/10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">

            {status === "success" ? (
              <div className="p-10 flex flex-col items-center text-center gap-4">
                <CheckCircle2 className="w-14 h-14 text-orange-500" />
                <h3 className="text-xl font-bold text-white">Slot Booked!</h3>
                <p className="text-white/50 text-sm max-w-xs">
                  Your slot for{" "}
                  <span className="text-white font-semibold">{selectedSlot.title}</span>{" "}
                  on{" "}
                  <span className="text-white font-semibold">
                    {formatDate(selectedSlot.date)}
                  </span>{" "}
                  at{" "}
                  <span className="text-white font-semibold">{selectedSlot.time}</span>{" "}
                  is confirmed. Check your email for details.
                </p>
                <button
                  onClick={resetModal}
                  className="mt-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-white/5">
                  <h3 className="text-lg font-bold text-white">Confirm Your Slot</h3>
                  <p className="text-white/40 text-sm mt-1">
                    {selectedSlot.title} · {formatDate(selectedSlot.date)} · {selectedSlot.time}
                  </p>
                </div>

                <div className="p-6 space-y-4">
                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-white/40 font-medium uppercase tracking-wider">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => {
                        setForm((p) => ({ ...p, name: e.target.value }))
                        if (status === "error") setStatus("idle")
                      }}
                      placeholder="Your full name"
                      className="px-4 py-3 rounded-xl bg-black border border-white/10 focus:border-orange-500/50 text-white text-sm outline-none transition-colors placeholder:text-white/20"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-white/40 font-medium uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => {
                        setForm((p) => ({ ...p, email: e.target.value }))
                        if (status === "error") setStatus("idle")
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleBook()}
                      placeholder="you@example.com"
                      className="px-4 py-3 rounded-xl bg-black border border-white/10 focus:border-orange-500/50 text-white text-sm outline-none transition-colors placeholder:text-white/20"
                    />
                  </div>

                  {status === "error" && (
                    <p className="text-red-400 text-sm">{errorMsg}</p>
                  )}
                </div>

                <div className="p-6 border-t border-white/5 flex gap-3">
                  <button
                    onClick={resetModal}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-xl text-sm font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBook}
                    disabled={status === "loading"}
                    className="flex-1 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                  >
                    {status === "loading" ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Booking...</>
                    ) : (
                      "Confirm Booking"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  )
}