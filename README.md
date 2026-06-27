# Claude API Wrapper

Full-stack API wrapper for Claude with dashboard UI.

## Tech Stack

- Next.js + React
- Tailwind CSS
- Firebase (Firestore)
- Vercel deployment

## Setup

```bash
npm install
cp .env.example .env
```

Configure `.env`:
```
CLAUDE_API_KEY=sk-ant-xxx
ADMIN_KEY=your-admin-key
FIREBASE_PROJECT_ID=xxx
FIREBASE_CLIENT_EMAIL=xxx@xxx.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
```

## Firebase Setup

1. Create Firestore database
2. Create collection: `api_keys`
3. Get service account credentials

## Development

```bash
npm run dev
```

## Deploy to Vercel

```bash
vercel --prod
```

Add environment variables in Vercel dashboard.

## Usage

```bash
curl -X POST https://your-domain.vercel.app/api/chat \
  -H "Authorization: Bearer sk-xxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-4",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

## Dashboard

Access `/` to manage API keys with admin key.
