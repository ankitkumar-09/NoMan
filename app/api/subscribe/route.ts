// app/api/subscribe/route.ts
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 m"),
})

const currentYear = new Date().getFullYear()

export async function POST(request: Request) {
  // Rate limit check
  const ip = request.headers.get("x-forwarded-for") ?? "anonymous"
  const { success } = await ratelimit.limit(ip)

  if (!success) {
    return Response.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429 }
    )
  }

  const { email } = await request.json()

  if (!email || !email.includes("@")) {
    return Response.json({ error: "Invalid email" }, { status: 400 })
  }

  const BREVO_API_KEY = process.env.BREVO_API_KEY

  if (!BREVO_API_KEY) {
    return Response.json({ error: "Server misconfigured" }, { status: 500 })
  }

 try {
  // Step 1: Check if contact already exists
  const checkRes = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
    method: "GET",
    headers: {
      "api-key": BREVO_API_KEY,
    },
  })

  if (checkRes.ok) {
    // Contact already exists — skip email, return 409
    return Response.json({ error: "Already subscribed" }, { status: 409 })
  }

  // Step 2: Add contact to Brevo list
  await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        email,
        listIds: [2],
        updateEnabled: true,
      }),
    })

    // Step 2: Send branded confirmation email
    const emailRes = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: "NoMan Studios",
          email: "studios@nomangames.store",
        },
        to: [{ email }],
        subject: "🎮 You're in! Welcome to NoMan Studios",
        htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>NoMan Studios | Welcome</title>
</head>
<body style="margin:0;padding:0;background-color:#050505;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#050505;padding:60px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:500px;background-color:#0f0f0f;border:1px solid #262626;border-radius:2px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.5);">
          
          <tr>
            <td align="center" style="padding:50px 0 20px;">
              <img src="https://res.cloudinary.com/dpnpmkhmb/image/upload/v1773735174/1_knbqwl.png" alt="NoMan Studios" width="56" height="56" style="display:block;border-radius:4px;border:1px solid #333333;" />
              <div style="height:1px;width:30px;background-color:#ea580c;margin-top:20px;"></div>
            </td>
          </tr>

          <tr>
            <td style="padding:0 45px 40px;text-align:center;">
              <h1 style="color:#ffffff;font-size:24px;font-weight:900;margin:0 0 16px;letter-spacing:2px;text-transform:uppercase;">Access Granted</h1>
              <p style="color:#888888;font-size:14px;line-height:1.7;margin:0 0 35px;font-weight:400;max-width:320px;display:inline-block;">
                Your subscription to NoMan Studios is confirmed. You are now registered for early-access announcements and closed beta testing phases.
              </p>
              
              <table align="center" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="background-color:#ffffff;border-radius:2px;">
                    <a href="https://www.nomangames.store" style="display:inline-block;color:#000000;font-size:12px;font-weight:800;text-decoration:none;padding:16px 45px;text-transform:uppercase;letter-spacing:2px;">
                      Visit Website
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

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
                &copy; ${currentYear} NOMAN STUDIOS &middot; CHENNAI, INDIA<br/>
                AUTHENTICATED TRANSMISSION
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
      }),
    })

    if (!emailRes.ok) throw new Error("Email send failed")

    return Response.json({ success: true })
  } catch {
    return Response.json({ error: "Something went wrong" }, { status: 500 })
  }
}

