// api/waitlist.js
// Saves email signups. In production, swap the console.log for a real DB
// (Vercel KV, Supabase, Airtable, or Mailchimp API — all free tiers available).

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, name, source } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  // Log the signup (visible in Vercel Function Logs dashboard)
  console.log(JSON.stringify({
    type: 'waitlist_signup',
    email,
    name: name || '',
    source: source || 'landing_page',
    timestamp: new Date().toISOString(),
  }));

  // ── OPTIONAL: Add Mailchimp integration ──────────────────────────────────
  // const MAILCHIMP_KEY = process.env.MAILCHIMP_API_KEY;
  // const MAILCHIMP_LIST = process.env.MAILCHIMP_LIST_ID;
  // if (MAILCHIMP_KEY && MAILCHIMP_LIST) {
  //   const dc = MAILCHIMP_KEY.split('-').pop(); // e.g. "us21"
  //   await fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST}/members`, {
  //     method: 'POST',
  //     headers: {
  //       Authorization: `Basic ${Buffer.from(`any:${MAILCHIMP_KEY}`).toString('base64')}`,
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ email_address: email, status: 'subscribed', merge_fields: { FNAME: name || '' } }),
  //   });
  // }
  // ─────────────────────────────────────────────────────────────────────────

  return res.status(200).json({ success: true, message: 'You\'re on the list!' });
}
