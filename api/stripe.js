export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  const { priceId } = req.body;
  
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: 'https://kaelthar.vercel.app?payment=success',
      cancel_url: 'https://kaelthar.vercel.app?payment=cancel',
    });
    res.status(200).json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}