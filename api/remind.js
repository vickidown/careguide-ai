// api/remind.js
// Called once daily by Vercel Cron (or manually).
// Checks all stored tasks and sends email reminders for anything due today or tomorrow.
// Uses Resend (free tier: 3,000 emails/month).

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const RESEND_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_KEY) {
    return res.status(500).json({ error: 'RESEND_API_KEY not configured in Vercel environment variables.' });
  }

  try {
    const { email, name, tasks } = req.body;

    if (!email || !tasks || !Array.isArray(tasks)) {
      return res.status(400).json({ error: 'email and tasks array required' });
    }

    const today     = new Date();
    const tomorrow  = new Date(today); tomorrow.setDate(today.getDate() + 1);
    const todayStr  = today.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // Filter tasks due today or tomorrow that aren't done
    const dueSoon = tasks.filter(t =>
      !t.done && t.date && (t.date === todayStr || t.date === tomorrowStr)
    );

    if (dueSoon.length === 0) {
      return res.status(200).json({ sent: false, message: 'No upcoming tasks to remind about.' });
    }

    // Build email HTML
    const taskRows = dueSoon.map(t => {
      const isToday = t.date === todayStr;
      const label = isToday ? '📅 TODAY' : '📆 TOMORROW';
      const color = isToday ? '#e07070' : '#c9a84c';
      return `
        <tr>
          <td style="padding:10px 16px; border-bottom:1px solid #e8f0ea;">
            <span style="font-size:12px; font-weight:600; color:${color}; margin-right:8px;">${label}</span>
            <span style="font-size:15px; color:#1a2e1e;">${t.text}</span>
          </td>
        </tr>`;
    }).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"/></head>
      <body style="margin:0; padding:0; background:#f5f0e8; font-family:'Georgia',serif;">
        <div style="max-width:520px; margin:32px auto; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(13,31,20,0.08);">
          
          <!-- Header -->
          <div style="background:#0d1f14; padding:28px 32px; text-align:center;">
            <div style="font-size:28px; margin-bottom:8px;">🌿</div>
            <h1 style="margin:0; font-size:22px; color:#fff; font-weight:400;">
              CareGuide <span style="color:#7cb88a;">AI</span>
            </h1>
            <p style="margin:6px 0 0; font-size:12px; color:#5a7a60; letter-spacing:0.08em; text-transform:uppercase;">
              Appointment Reminder
            </p>
          </div>

          <!-- Body -->
          <div style="padding:28px 32px;">
            <p style="margin:0 0 6px; font-size:16px; color:#1a2e1e;">
              Hi ${name || 'there'},
            </p>
            <p style="margin:0 0 20px; font-size:15px; color:#5a7a60; line-height:1.6;">
              You have ${dueSoon.length} upcoming care task${dueSoon.length > 1 ? 's' : ''} that need${dueSoon.length === 1 ? 's' : ''} your attention:
            </p>

            <table style="width:100%; border-collapse:collapse; background:#f5f0e8; border-radius:10px; overflow:hidden;">
              ${taskRows}
            </table>

            <p style="margin:20px 0 0; font-size:13px; color:#8a9e8f; line-height:1.6;">
              Stay on top of your caregiving schedule. You're doing an amazing job. 💚
            </p>
          </div>

          <!-- Footer -->
          <div style="padding:16px 32px 24px; border-top:1px solid #e8f0ea; text-align:center;">
            <a href="https://careguideai.ca" style="font-size:13px; color:#3d7a52; text-decoration:none;">
              Open CareGuide AI →
            </a>
            <p style="margin:8px 0 0; font-size:11px; color:#aaa;">
              CareGuide AI · Serving all of Ontario<br/>
              <a href="https://careguideai.ca" style="color:#aaa;">Unsubscribe from reminders</a>
            </p>
          </div>
        </div>
      </body>
      </html>`;

    // Send via Resend
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_KEY}`,
      },
      body: JSON.stringify({
        from: 'CareGuide AI <reminders@careguideai.ca>',
        to: [email],
        subject: `🌿 Reminder: ${dueSoon.length} upcoming care task${dueSoon.length > 1 ? 's' : ''} — CareGuide AI`,
        html,
      }),
    });

    if (!resendRes.ok) {
      const err = await resendRes.text();
      console.error('Resend error:', err);
      return res.status(500).json({ error: 'Failed to send email reminder.' });
    }

    return res.status(200).json({ sent: true, count: dueSoon.length });

  } catch (err) {
    console.error('Remind error:', err);
    return res.status(500).json({ error: err.message });
  }
}
