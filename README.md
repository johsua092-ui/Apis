# Claude API Wrapper

API wrapper untuk Claude dengan sistem API key custom.

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env`:
```
CLAUDE_API_KEY=sk-ant-xxx
API_KEYS=sk-custom1,sk-custom2
PORT=3000
```

## Run

```bash
npm start
```

## Usage

```bash
curl -X POST http://localhost:3000/v1/messages \
  -H "Authorization: Bearer sk-custom1" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-4",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

## Endpoints

- `POST /v1/messages` - Standard response
- `POST /v1/messages/stream` - Streaming response
