// Vercel Serverless Function — creates a Stripe Checkout Session.
// Runs server-side only: the Stripe secret key never reaches the browser.
//
// Required environment variables (set in the Vercel project settings):
//   STRIPE_SECRET_KEY        e.g. sk_live_... or sk_test_...
//   STRIPE_PRICE_ONLINE      Price ID for the £729 Online Programme
//   STRIPE_PRICE_HYBRID      Price ID for the £849 Hybrid Programme
//   SITE_URL                 e.g. https://elite-british-pronunciation.vercel.app
//
// See README.md for how to create the two Stripe Prices and where to
// paste these values into Vercel.

const Stripe = require('stripe');

const PLANS = {
  online: { envKey: 'STRIPE_PRICE_ONLINE', label: 'Online Programme' },
  hybrid: { envKey: 'STRIPE_PRICE_HYBRID', label: 'Hybrid Programme' },
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(503).json({
      error: 'stripe_not_configured',
      message: 'STRIPE_SECRET_KEY is not set for this deployment yet.',
    });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  body = body || {};

  const plan = PLANS[body.plan];
  if (!plan) {
    return res.status(400).json({ error: 'invalid_plan' });
  }

  const priceId = process.env[plan.envKey];
  if (!priceId) {
    return res.status(503).json({
      error: 'price_not_configured',
      message: `${plan.envKey} is not set for this deployment yet.`,
    });
  }

  const siteUrl = process.env.SITE_URL || `https://${req.headers.host}`;

  try {
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/?checkout=success&plan=${body.plan}`,
      cancel_url: `${siteUrl}/?checkout=cancelled`,
      billing_address_collection: 'auto',
      allow_promotion_codes: true,
      metadata: { plan: body.plan, programme: plan.label },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout session error:', err);
    return res.status(500).json({ error: 'stripe_error', message: err.message });
  }
};
