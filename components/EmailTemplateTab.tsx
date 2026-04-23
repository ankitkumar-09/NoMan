"use client"

// ─── EmailTemplateTab ─────────────────────────────────────────────────────────
// Drop this component into your admin/careers page.
// Usage: {tab === "email" && <EmailTemplateTab secret={secret} />}
//
// Also add "email" to your tab union type and tab bar:
//   type Tab = "jobs" | "applications" | "slots" | "email"
//   tabs: [..., "email"]

import { useEffect, useState, useRef } from "react"
import { Loader2, Save, RefreshCw, Eye, Code2, Copy, Check, Info } from "lucide-react"

// ─── Variable tokens the template supports ────────────────────────────────────
const TEMPLATE_VARS = [
  { token: "{{name}}",     desc: "Applicant's full name" },
  { token: "{{jobTitle}}", desc: "Role they applied for" },
  { token: "{{year}}",     desc: "Current year (auto)" },
]

// ─── Default HTML template (mirrors your existing email) ─────────────────────
export const DEFAULT_EMAIL_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Application Received</title>
</head>
<body style="margin:0;padding:0;background-color:#050505;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#050505;padding:60px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:500px;background-color:#0f0f0f;border:1px solid #262626;border-radius:2px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.5);">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding:50px 0 20px;">
              <img src="https://res.cloudinary.com/dpnpmkhmb/image/upload/v1773735174/1_knbqwl.png" alt="NoMan Studios" width="56" height="56" style="display:block;border-radius:4px;border:1px solid #333333;" />
              <div style="height:1px;width:30px;background-color:#ea580c;margin-top:20px;"></div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:0 45px 40px;text-align:center;">
              <h1 style="color:#ffffff;font-size:22px;font-weight:900;margin:0 0 8px;letter-spacing:2px;text-transform:uppercase;">Application Received</h1>
              <p style="color:#ea580c;font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 30px;">{{jobTitle}}</p>

              <p style="color:#888888;font-size:15px;line-height:1.9;margin:0 0 24px;">
                Hi <span style="color:#ffffff;font-weight:700;">{{name}}</span>,
              </p>
              <p style="color:#888888;font-size:14px;line-height:1.9;margin:0 0 30px;">
                Thank you for applying to <span style="color:#ffffff;font-weight:600;">{{jobTitle}}</span> at <span style="color:#ffffff;font-weight:600;">NoMan Studios</span>. We have received your application and our team will carefully review it.
              </p>
              <p style="color:#666666;font-size:13px;line-height:1.8;margin:0 0 35px;">
                If shortlisted, we will reach out to you directly. In the meantime, feel free to explore our games and stay connected with us on social media.
              </p>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:30px;">
                <tr><td style="border-top:1px solid #222222;"></td></tr>
              </table>

              <p style="color:#666666;font-size:13px;line-height:1.8;margin:0 0 35px;max-width:340px;display:inline-block;">
                While you wait, explore our games and follow our journey — we're building something exciting.
              </p>

              <!-- CTA -->
              <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;">
                <tr>
                  <td align="center" style="background-color:#ea580c;border-radius:2px;">
                    <a href="https://www.nomangames.store" style="display:inline-block;color:#ffffff;font-size:12px;font-weight:800;text-decoration:none;padding:16px 45px;text-transform:uppercase;letter-spacing:2px;">
                      Explore Our Games
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color:#444444;font-size:11px;margin:0;letter-spacing:0.5px;">
                We'll be in touch if your profile is a match.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#0a0a0a;padding:40px;border-top:1px solid #222222;text-align:center;">
              <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:25px;">
                <tr>
                  <td style="padding:0 15px;">
                    <a href="https://www.linkedin.com/company/nomanprod/">
                      <img src="https://cdn-icons-png.flaticon.com/512/3536/3536505.png" width="18" height="18" alt="LinkedIn" style="filter:invert(1);opacity:0.6;" />
                    </a>
                  </td>
                  <td style="padding:0 15px;">
                    <a href="https://www.instagram.com/noman__.games/">
                      <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" width="18" height="18" alt="Instagram" style="filter:invert(1);opacity:0.6;" />
                    </a>
                  </td>
                  <td style="padding:0 15px;">
                    <a href="https://www.youtube.com/channel/UCQWzNg1ToM8umNt0YUaIVhw">
                      <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" width="18" height="18" alt="YouTube" style="filter:invert(1);opacity:0.6;" />
                    </a>
                  </td>
                </tr>
              </table>
              <p style="color:#444444;font-size:10px;margin:0;letter-spacing:1px;line-height:1.6;font-weight:600;text-transform:uppercase;">
                &copy; {{year}} NOMAN STUDIOS &middot; CHENNAI, INDIA<br/>
                THIS IS AN AUTOMATED MESSAGE — PLEASE DO NOT REPLY
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

// ─── Component ────────────────────────────────────────────────────────────────

export function EmailTemplateTab({ secret }: { secret: string }) {
  const [html, setHtml] = useState("")
  const [subject, setSubject] = useState("🎮 Application Received — {{jobTitle}}")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [view, setView] = useState<"split" | "code" | "preview">("split")
  const [copied, setCopied] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // ── Fetch saved template ──────────────────────────────────────────────────

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/email-template", {
          headers: { "x-admin-secret": secret },
        })
        if (res.ok) {
          const data = await res.json()
          setHtml(data.html || DEFAULT_EMAIL_TEMPLATE)
          setSubject(data.subject || "🎮 Application Received — {{jobTitle}}")
        } else {
          setHtml(DEFAULT_EMAIL_TEMPLATE)
        }
      } catch {
        setHtml(DEFAULT_EMAIL_TEMPLATE)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [secret])

  // ── Live preview refresh ──────────────────────────────────────────────────

  const previewHtml = html
    .replace(/\{\{name\}\}/g, "Alex Johnson")
    .replace(/\{\{jobTitle\}\}/g, "Gameplay Programmer")
    .replace(/\{\{year\}\}/g, new Date().getFullYear().toString())

  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument
      if (doc) {
        doc.open()
        doc.write(previewHtml)
        doc.close()
      }
    }
  }, [previewHtml])

  // ── Save ──────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/email-template", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-secret": secret },
        body: JSON.stringify({ html, subject }),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        alert("Failed to save template.")
      }
    } finally {
      setSaving(false)
    }
  }

  // ── Reset to default ──────────────────────────────────────────────────────

  const handleReset = () => {
    if (!confirm("Reset to the original default template? Unsaved changes will be lost.")) return
    setHtml(DEFAULT_EMAIL_TEMPLATE)
    setSubject("🎮 Application Received — {{jobTitle}}")
  }

  // ── Copy token ────────────────────────────────────────────────────────────

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token)
    setCopied(token)
    setTimeout(() => setCopied(null), 1500)
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) return <Loader2 className="animate-spin mx-auto text-orange-500 mt-10" />

  return (
    <div className="space-y-6">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-white font-bold text-lg">Application Email Template</h2>
          <p className="text-white/40 text-xs mt-0.5">
            Sent automatically when someone applies. Use <code className="text-orange-400">{"{{name}}"}</code>, <code className="text-orange-400">{"{{jobTitle}}"}</code> as placeholders.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-orange-600 hover:bg-orange-500 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : saved ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            {saved ? "Saved!" : "Save Template"}
          </button>
        </div>
      </div>

      {/* ── Variable tokens ────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 p-4 bg-white/[0.02] border border-white/10 rounded-2xl">
        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest self-center mr-2">
          <Info className="w-3 h-3 inline mr-1 mb-0.5" />Variables
        </span>
        {TEMPLATE_VARS.map(({ token, desc }) => (
          <button
            key={token}
            onClick={() => copyToken(token)}
            title={desc}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-black border border-orange-500/20 rounded-lg text-[11px] font-mono text-orange-400 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all"
          >
            {token}
            {copied === token ? (
              <Check className="w-3 h-3 text-green-400" />
            ) : (
              <Copy className="w-3 h-3 opacity-40" />
            )}
          </button>
        ))}
        <span className="text-[10px] text-white/20 self-center ml-1">click to copy · hover for description</span>
      </div>

      {/* ── Subject line ───────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-white/40 uppercase font-bold px-1 tracking-widest">
          Email Subject Line
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full px-4 py-3 bg-black border border-white/10 focus:border-orange-500/40 rounded-xl text-white text-sm outline-none transition-all font-mono"
        />
      </div>

      {/* ── View toggle ────────────────────────────────────────────────── */}
      <div className="flex gap-1 p-1 bg-white/5 border border-white/5 rounded-2xl w-fit">
        {([
          { key: "split",   label: "Split",   icon: <Code2 className="w-3.5 h-3.5" /> },
          { key: "code",    label: "Code",    icon: <Code2 className="w-3.5 h-3.5" /> },
        ] as const).map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setView(key)}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
              view === key ? "bg-orange-600 text-white" : "text-white/30 hover:text-white"
            }`}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {/* ── Editor / Preview ───────────────────────────────────────────── */}
      <div
        className={`gap-4 ${
          view === "split" ? "grid grid-cols-1 lg:grid-cols-2" : "block"
        }`}
        style={{ height: view === "split" ? 680 : "auto" }}
      >
        {/* Code editor */}
        {(view === "split" || view === "code") && (
          <div className="flex flex-col h-full">
            <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2 px-1">
              HTML Editor
            </div>
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              spellCheck={false}
              className="flex-1 w-full bg-black border border-white/10 focus:border-orange-500/30 rounded-2xl p-5 text-[12px] font-mono text-white/80 outline-none resize-none leading-relaxed transition-all"
              style={{
                height: view === "code" ? 680 : "100%",
                tabSize: 2,
              }}
              onKeyDown={(e) => {
                // Tab key inserts 2 spaces instead of jumping focus
                if (e.key === "Tab") {
                  e.preventDefault()
                  const el = e.currentTarget
                  const start = el.selectionStart
                  const end = el.selectionEnd
                  const newVal = el.value.substring(0, start) + "  " + el.value.substring(end)
                  setHtml(newVal)
                  requestAnimationFrame(() => {
                    el.selectionStart = el.selectionEnd = start + 2
                  })
                }
              }}
            />
          </div>
        )}

        {/* Live preview */}
        {(view === "split" || view === "preview") && (
          <div className="flex flex-col h-full">
            <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2 px-1">
              Live Preview <span className="text-orange-500/50 normal-case font-normal">(sample values)</span>
            </div>
            <div
              className="flex-1 rounded-2xl overflow-hidden border border-white/10 bg-white"
              style={{ height: view === "preview" ? 680 : "100%" }}
            >
              <iframe
                ref={iframeRef}
                title="Email Preview"
                className="w-full h-full border-0"
                sandbox="allow-same-origin"
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Save button (bottom) ───────────────────────────────────────── */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-10 py-3.5 bg-orange-600 hover:bg-orange-500 rounded-2xl font-bold text-sm transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Template Saved!" : "Save Template"}
        </button>
      </div>

    </div>
  )
}