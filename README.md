# Checkout starter — Zaad / eDahab

## Run it

```bash
cd backend
npm install
cp .env.example .env   # then fill in your real eDahab/Zaad credentials
npm run dev
```

Open `frontend/checkout.html` directly in a browser (it calls the backend at `http://localhost:4000`).

## Push to GitHub

```bash
git init
git add .
git commit -m "Checkout starter"
git remote add origin <your-repo-url>
git push -u origin main
```

`.gitignore` already excludes `.env`, so your real API keys never leave your machine.
Anyone cloning the repo copies `.env.example` to `.env` and fills in their own credentials.

## What's stubbed vs. real

- **eDahab**: `server.js` returns a fake invoice ID and marks it "paid" after 3 seconds — swap in the real `IssueInvoice` call once you have API credentials (docs.edahab.net).
- **Zaad**: returns a "not yet configured" error — Zaad requires a signed business agreement before issuing API access, so this branch is a placeholder until that's in place.
- **Webhook route** (`/api/checkout/webhook`) is unverified — add signature checking before going live.
