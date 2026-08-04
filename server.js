require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory store for demo purposes only — use a real database in production.
const invoices = {};

app.post('/api/checkout/charge', async (req, res) => {
  const { phone, amount, provider } = req.body;

  if (!phone || !amount || !provider) {
    return res.status(400).json({ error: 'phone, amount, and provider are required' });
  }

  const digits = phone.replace(/\D/g, '');

  try {
    if (provider === 'edahab') {
      // eDahab numbers starting with 62 don't support the pop-up push —
      // tell the frontend to show manual dial instructions instead.
      if (digits.startsWith('62')) {
        return res.json({ status: 'manual_required', invoiceId: null });
      }

      // TODO: replace with the real eDahab IssueInvoice call once you have
      // your API key + agent code. Their docs describe a hash generated
      // from your credentials as a signing step — see docs.edahab.net.
      const invoiceId = 'ED-' + Math.floor(100000 + Math.random() * 900000);
      invoices[invoiceId] = { status: 'pending', provider, phone, amount };

      // Simulate the customer approving on their phone after a delay.
      setTimeout(() => { invoices[invoiceId].status = 'paid'; }, 3000);

      return res.json({ status: 'pending', invoiceId });
    }

    if (provider === 'zaad') {
      // Zaad requires a signed business agreement before you get API
      // credentials — this branch is a placeholder until that's in place.
      return res.status(501).json({ error: 'Zaad integration not yet configured' });
    }

    return res.status(400).json({ error: 'Unknown provider' });
  } catch (err) {
    console.error(err);
    return res.status(502).json({ error: 'Payment provider request failed' });
  }
});

// Frontend polls this to know when to show the success screen.
app.get('/api/checkout/status/:invoiceId', (req, res) => {
  const invoice = invoices[req.params.invoiceId];
  if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
  res.json({ status: invoice.status });
});

// eDahab/Zaad webhook target — point their dashboard at this URL in production.
app.post('/api/checkout/webhook', (req, res) => {
  console.log('Webhook received:', req.body);
  // TODO: verify the webhook signature, then update invoices[...] to 'paid'.
  res.sendStatus(200);
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Checkout backend running on port ${port}`));
