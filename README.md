# Elite British English Pronunciation Programme

Landing page for Sanda Beniamines' Elite British English Pronunciation Programme (Creative English Language Academy).

- `index.html` — the full single-page site (self-contained: inline CSS + JS, Google Fonts only).
- `api/create-checkout-session.js` — a Vercel serverless function that creates a Stripe Checkout Session server-side, so the secret key never reaches the browser.
- `vercel.json`, `package.json` — deployment config.

## Go live on Vercel (one time, ~2 minutes)

1. Go to [vercel.com](https://vercel.com) and sign in with the `sbnn3` GitHub account.
2. Click **Add New → Project**, select this repository (`elite-british-pronunciation`), and click **Deploy**. No build settings are needed — it's a static site plus one serverless function.
3. You'll get a live URL immediately, e.g. `https://elite-british-pronunciation.vercel.app`. Every future push to `main` redeploys it automatically.
4. When ready, attach the real domain under **Project → Settings → Domains**.

## Connect Stripe (when you're ready to take real payments)

1. In your [Stripe Dashboard](https://dashboard.stripe.com), create two **Products**, each with one **Price**:
   - "Online Programme" — one-time price, £729 GBP
   - "Hybrid Programme" — one-time price, £849 GBP
   
   Copy each Price's ID (starts with `price_...`).
2. In the Vercel project, go to **Settings → Environment Variables** and add:
   - `STRIPE_SECRET_KEY` — your Stripe secret key (starts with `sk_test_...` while testing, `sk_live_...` once live)
   - `STRIPE_PRICE_ONLINE` — the Online Programme price ID
   - `STRIPE_PRICE_HYBRID` — the Hybrid Programme price ID
   - `SITE_URL` — your live URL, e.g. `https://elite-british-pronunciation.vercel.app`
3. Redeploy (Vercel does this automatically after saving env vars, or trigger it from the Deployments tab).
4. Test with Stripe's [test card `4242 4242 4242 4242`](https://docs.stripe.com/testing) before switching to live keys.

Until these are set, the "Choose Online / Hybrid" buttons open a reservation modal and show a friendly message instead of failing — the page never breaks, it just isn't charging yet.

## Editing the content

Everything is in `index.html`. Text lives in plain HTML near the top-to-bottom order of the page; styling is in the single `<style>` block; behaviour (FAQ accordion, scroll reveals, Stripe checkout call) is in the `<script>` block at the bottom. No build step — edit and refresh.

### Known placeholders to replace later

- Sanda's portrait in the hero, and the two "message from Sanda" video/photo panels — currently a styled monogram placeholder (`.hero-portrait`, `.video-cutout`). Swap for a real photo or the cut-out video Sanda described.
- The two testimonials (Marius, Elena) are the two real quotes from the brief. More can be added by duplicating a `.testi-card`.
- The workshop-dates calendar/infographic mentioned in the brief isn't built yet — flagged for a follow-up so it can be updated centrally each cohort rather than across the whole site.
- The "Trusted by" strip lists institution names as text; swap for real logos when available.

## Local preview

Any static server works, e.g.:

```bash
npx serve .
```

The Stripe button will show the "not connected yet" message locally unless you run `vercel dev` with the environment variables above set in `.env.local`.
