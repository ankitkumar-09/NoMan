"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import {
  Calendar,
  Clock,
  CheckCircle2,
  Loader2,
  Lock,
  ChevronRight,
  ShieldAlert,
  AlertTriangle,
} from "lucide-react"

interface Slot {
  _id: string
  title: string
  date: string
  time: string
  duration: string
  note: string
  isBooked: boolean
  bookedBy: { name: string; email: string; bookedAt: string } | null
}

interface VerifyData {
  valid: boolean
  name: string
  email: string
  jobTitle: string
  visitsRemaining: number
  willExpireNext: boolean
  alreadyBooked: boolean
  bookedSlot: {
    title: string
    date: string
    time: string
    duration: string
  } | null
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

function TokenErrorScreen({
  message,
  expired,
}: {
  message: string
  expired?: boolean
}) {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-red-400" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">
            {expired ? "Link Expired" : "Access Denied"}
          </h1>
          <p className="text-white/40 text-sm leading-relaxed max-w-sm mx-auto">
            {message}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-white/30 text-xs">
          If you believe this is an error, please contact us at{" "}
          <span className="text-orange-400">studios@nomangames.store</span>
        </div>
      </div>
    </main>
  )
}

function AlreadyBookedScreen({
  name,
  slot,
}: {
  name: string
  slot: { title: string; date: string; time: string; duration: string }
}) {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-600/10 border border-orange-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-orange-400" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">Already Booked!</h1>
          <p className="text-white/40 text-sm">
            Hi {name}, you have already reserved your slot.
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 text-left space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-orange-500">
            Your Slot
          </p>
          <h3 className="text-white font-bold text-lg">{slot.title}</h3>
          <div className="flex flex-col gap-2 text-sm text-white/50">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-500/70" />
              {formatDate(slot.date)}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500/70" />
              {slot.time} · {slot.duration}
            </span>
          </div>
        </div>
        <p className="text-white/25 text-xs">
          Check your email for the confirmation details and interview link.
        </p>
      </div>
    </main>
  )
}

// ── Inner component that uses useSearchParams ──────────────────────────────
function SlotsContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [verifying, setVerifying] = useState(true)
  const [verifyData, setVerifyData] = useState<VerifyData | null>(null)
  const [tokenError, setTokenError] = useState<{
    message: string
    expired?: boolean
  } | null>(null)

  const [slots, setSlots] = useState<Slot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)

  // FIX: was missing the opening < for the generic type — syntax error
  const [bookingStatus, setBookingStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle")
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    if (!token) {
      setTokenError({
        message:
          "No access token found. Please use the link provided in your invitation email.",
      })
      setVerifying(false)
      return
    }

    fetch("/api/slots/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.expired) {
          setTokenError({ message: data.error, expired: true })
        } else if (data.error) {
          setTokenError({ message: data.error })
        } else {
          setVerifyData(data)
        }
      })
      .catch(() => {
        setTokenError({
          message: "Failed to verify your link. Please try again.",
        })
      })
      .finally(() => setVerifying(false))
  }, [token])

  useEffect(() => {
    if (!verifyData) return
    setLoadingSlots(true)
    fetch("/api/slots")
      .then((r) => r.json())
      .then((d) => setSlots(d.slots || []))
      .finally(() => setLoadingSlots(false))
  }, [verifyData])

  const handleBook = async () => {
    if (!selectedSlot || !verifyData) return

    setBookingStatus("loading")
    setErrorMsg("")

    try {
      const res = await fetch(`/api/slots/${selectedSlot._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: verifyData.name,
          email: verifyData.email,
        }),
      })

      const data = await res.json()

      if (res.status === 409) {
        setErrorMsg(data.error || "This slot is already booked.")
        setBookingStatus("error")
        return
      }

      if (res.status === 403) {
        setErrorMsg("Access denied. Your invitation could not be verified.")
        setBookingStatus("error")
        return
      }

      if (!res.ok) throw new Error()

      setSlots((prev) =>
        prev.map((s) =>
          s._id === selectedSlot._id
            ? {
                ...s,
                isBooked: true,
                bookedBy: {
                  name: verifyData.name,
                  email: verifyData.email,
                  bookedAt: new Date().toISOString(),
                },
              }
            : s
        )
      )
      setBookingStatus("success")
    } catch {
      setErrorMsg("Something went wrong. Please try again.")
      setBookingStatus("error")
    }
  }

  const resetModal = () => {
    setSelectedSlot(null)
    setBookingStatus("idle")
    setErrorMsg("")
  }

  if (verifying) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          <p className="text-white/30 text-sm">Verifying your link...</p>
        </div>
      </main>
    )
  }

  if (tokenError) {
    return (
      <TokenErrorScreen
        message={tokenError.message}
        expired={tokenError.expired}
      />
    )
  }

  if (verifyData?.alreadyBooked && verifyData.bookedSlot) {
    return (
      <AlreadyBookedScreen
        name={verifyData.name}
        slot={verifyData.bookedSlot}
      />
    )
  }

  const grouped = groupByDate(slots)
  const sortedDates = Object.keys(grouped).sort()
  const availableCount = slots.filter((s) => !s.isBooked).length

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative pt-32 pb-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(234,88,12,0.12)_0%,_transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_60%,black)] pointer-events-none" />

        <span className="inline-flex items-center gap-2 bg-orange-600/15 border border-orange-500/30 text-orange-400 text-[11px] font-semibold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full mb-6">
          <Calendar className="w-3 h-3" />
          Interview Slots
        </span>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 relative z-10">
          Welcome,{" "}
          <span className="text-orange-500">
            {verifyData?.name.split(" ")[0]}
          </span>
        </h1>
        <p className="text-white/50 text-sm sm:text-base max-w-xl mx-auto relative z-10">
          You&apos;re invited to interview for{" "}
          <span className="text-white font-semibold">{verifyData?.jobTitle}</span>.
          Select your preferred slot below.
        </p>

       {verifyData && verifyData.visitsRemaining === 0 && (
  <div className="mt-6 inline-flex items-center gap-2 bg-amber-600/10 border border-amber-500/20 text-amber-400 text-xs font-medium px-4 py-2 rounded-full">
    <AlertTriangle className="w-3 h-3" />
    This is your last visit — this link will expire after you leave
  </div>
)}

        {verifyData && verifyData.visitsRemaining > 0 && !verifyData.willExpireNext && (
          <div className="mt-6 inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white/30 text-xs font-medium px-4 py-2 rounded-full">
            {verifyData.visitsRemaining} visit{verifyData.visitsRemaining !== 2 ? "s" : ""} remaining on this link
          </div>
        )}
      </section>

      <section className="px-4 pb-32 max-w-3xl mx-auto">
        {loadingSlots ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : slots.length === 0 ? (
          <div className="text-center py-24 text-white/30">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No slots available yet</p>
            <p className="text-sm mt-1">Please check back soon or contact us.</p>
          </div>
        ) : availableCount === 0 ? (
          <div className="text-center py-24 text-white/30">
            <Lock className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">All slots are booked</p>
            <p className="text-sm mt-1">
              Please contact us at{" "}
              <span className="text-orange-400">studios@nomangames.store</span>
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {sortedDates.map((date) => (
              <div key={date}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500 px-2">
                    {formatDate(date)}
                  </span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <div className="grid gap-3">
                  {grouped[date].map((slot) => (
                    <div
                      key={slot._id}
                      onClick={() => !slot.isBooked && setSelectedSlot(slot)}
                      className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border transition-all ${
                        slot.isBooked
                          ? "bg-white/[0.01] border-white/5 opacity-40 cursor-not-allowed"
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

                        <h3
                          className={`font-bold text-base ${
                            slot.isBooked
                              ? "text-white/30"
                              : "text-white group-hover:text-orange-400 transition-colors"
                          }`}
                        >
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
                          {slot.note && (
                            <span className="text-white/25 italic">{slot.note}</span>
                          )}
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

      {selectedSlot && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-white/10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
            {bookingStatus === "success" ? (
              <div className="p-10 flex flex-col items-center text-center gap-4">
                <CheckCircle2 className="w-14 h-14 text-orange-500" />
                <h3 className="text-xl font-bold text-white">Slot Confirmed!</h3>
                <p className="text-white/50 text-sm max-w-xs">
                  Your slot for{" "}
                  <span className="text-white font-semibold">{selectedSlot.title}</span>{" "}
                  on{" "}
                  <span className="text-white font-semibold">{formatDate(selectedSlot.date)}</span>{" "}
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
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                    <p className="text-xs text-white/30 uppercase tracking-wider font-medium">
                      Booking As
                    </p>
                    <p className="text-white font-semibold text-sm">{verifyData?.name}</p>
                    <p className="text-white/40 text-xs">{verifyData?.email}</p>
                  </div>

                  <p className="text-white/30 text-xs text-center">
                    This slot will be booked under your invitation details.
                  </p>

                  {bookingStatus === "error" && (
                    <p className="text-red-400 text-sm text-center">{errorMsg}</p>
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
                    disabled={bookingStatus === "loading"}
                    className="flex-1 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                  >
                    {bookingStatus === "loading" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Booking...
                      </>
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

// FIX: Wrap with Suspense — required by Next.js 13+ for useSearchParams()
export default function SlotsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-black flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </main>
      }
    >
      <SlotsContent />
    </Suspense>
  )
}