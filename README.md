# 🌿 CareGuide AI — Complete Deployment Guide
**careguideai.ca · St. Thomas, Ontario**

---

## 📁 Project Structure

```
careguide-ai/
├── api/
│   ├── chat.js          ← SECURE: Anthropic proxy (API key hidden from browser)
│   └── waitlist.js      ← Saves email signups (visible in Vercel logs)
├── public/
│   └── index.html
├── src/
│   ├── App.js           ← Router: landing → auth → dashboard (+ /admin)
│   ├── index.js
│   ├── index.css
│   ├── pages/
│   │   ├── Landing.js        ← Full marketing site
│   │   ├── AuthScreen.js     ← Sign up / sign in
│   │   ├── Dashboard.js      ← Main app (6 tools)
│   │   └── AdminDashboard.js ← Business metrics (visit /admin)
│   └── components/
│       ├── ChatPanel.js      ← AI chat → calls /api/chat securely
│       ├── TaskTracker.js    ← Care task tracker
│       └── LocalResources.js ← Elgin County directory + upgrade modal
├── package.json
├── vercel.json          ← API routes + SPA routing
└── README.md
```

---

## 🚀 DEPLOY IN 4 STEPS

### STEP 1 — GitHub (5 min)
1. Go to **github.com** → sign in or create free account
2. Click **"+"** top right → **"New repository"**
3. Name: `careguide-ai` → Public → click **Create repository**
4. Click **"uploading an existing file"**
5. **Unzip** `careguide-ai-v2.zip` on your computer
6. Drag ALL files into GitHub (keep the `api/`, `src/`, `public/` folder structure)
7. Click **"Commit changes"** — done

### STEP 2 — Vercel (2 min)
1. Go to **vercel.com** → click **"Sign Up"** → choose **"Continue with GitHub"**
2. Click **"Add New Project"** → find **careguide-ai** → click **Import**
3. Leave all settings as default → click **"Deploy"**
4. ✅ Live at `careguide-ai.vercel.app` in ~60 seconds

### STEP 3 — Add Your Anthropic API Key (3 min)
This keeps your API key 100% secure — never visible to users.

1. Get your key at **console.anthropic.com** → API Keys → Create Key
2. In Vercel dashboard → your project → **Settings** → **Environment Variables**
3. Click **Add New**:
   - Name:  `ANTHROPIC_API_KEY`
   - Value: `sk-ant-...` (your key)
   - Environments: ✅ Production ✅ Preview ✅ Development
4. Click **Save** → then go to **Deployments** → click **Redeploy**
5. ✅ AI features now work on your live site

### STEP 4 — Connect careguideai.ca (10 min)
**In Vercel:**
1. Your project → **Settings** → **Domains** → type `careguideai.ca` → Add
2. Click the **"Nameservers"** tab → copy both nameserver addresses (e.g. `ns1.vercel-dns.com`)

**In Namecheap:**
1. Log in → **Domain List** → **Manage** next to careguideai.ca
2. **Nameservers** section → dropdown → **Custom DNS**
3. Paste both Vercel nameservers → click green ✓ save
4. ✅ Live at **careguideai.ca** within 1 hour (max 48 hours)

---

## 💳 Add Stripe Payments (15 min)

1. Go to **stripe.com** → create free account → switch to **Canada**
2. **Products** → **Add product**:
   - Name: `CareGuide Family Plan`
   - Price: `$19.00 CAD` → Recurring → Monthly
3. Click **Payment links** → **Create payment link** → copy the URL
4. Repeat for Organization: `$79.00 CAD`
5. In `src/pages/Dashboard.js`, find:
   ```js
   // window.location.href = 'https://buy.stripe.com/YOUR_LINK';
   ```
   Replace `YOUR_LINK` with your Stripe link and remove the `//`
6. Push to GitHub → Vercel auto-redeploys in ~30 seconds

---

## 📊 Admin Dashboard

Visit **careguideai.ca/admin** to see:
- Total signups, paying users, MRR
- Revenue breakdown by plan
- User list with emails and locations

**Default password:** `careguide2026`

⚠️ Change this before going live! Edit `ADMIN_PASSWORD` in `src/pages/AdminDashboard.js`

---

## 📧 See Waitlist Signups

Every email captured on the landing page is logged to Vercel.

1. Vercel dashboard → your project → **Logs** tab
2. Filter by `waitlist_signup`
3. You'll see every email with timestamp

**Or connect Mailchimp** (free tier, 500 contacts):
- Uncomment the Mailchimp block in `api/waitlist.js`
- Add `MAILCHIMP_API_KEY` and `MAILCHIMP_LIST_ID` in Vercel environment variables

---

## 📧 Set Up hello@careguideai.ca

1. In Namecheap → your domain → **Private Email** → purchase ($1.48/mo)
2. Follow Namecheap's setup guide — takes ~5 min
3. Or use **Cloudflare Email Routing** (free) to forward to your Gmail

---

## 🔒 Security Notes

- ✅ Anthropic API key is stored in Vercel env vars — never in browser code
- ✅ `/api/chat` only accepts requests from your domain
- ✅ Input validation on all API routes
- ✅ Admin dashboard is password protected

**For production with many users**, add rate limiting to `/api/chat`:
- Use **Vercel KV** (free tier) to count requests per IP
- Or use **Upstash Redis** (free tier, 10k requests/day)

---

## 💰 Pricing & Revenue

| Plan         | Price     | Your Cost/user | Margin |
|-------------|-----------|----------------|--------|
| Free        | $0        | ~$0.05/mo      | —      |
| Family      | $19 CAD   | ~$1.50/mo      | ~92%   |
| Organization| $79 CAD   | ~$4/mo         | ~95%   |

**AI API cost:** ~$0.003 per conversation (Claude Sonnet)
**Hosting:** Free on Vercel (up to 100GB bandwidth)
**Break-even:** 15 paying Family users = ~$285/mo covers all costs

---

## 📞 Need Help?

You've got everything you need. If you get stuck on any step:
- Vercel docs: vercel.com/docs
- Namecheap DNS guide: namecheap.com/support

Built for St. Thomas & Elgin County. 🌿
