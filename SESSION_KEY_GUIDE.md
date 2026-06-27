# How to Get Claude Session Key

1. Open https://claude.ai in browser
2. Login to your account
3. Open DevTools (F12)
4. Go to Application/Storage tab
5. Click Cookies → https://claude.ai
6. Find `sessionKey` cookie
7. Copy the value
8. Paste to `.env` as `CLAUDE_SESSION_KEY`

**WARNING:**
- This method violates Claude's ToS
- Your account can be banned
- Session key expires (need refresh)
- Use at your own risk

**Alternative:**
- Use Groq (free, legal, stable)
- Use DeepSeek (free, legal)
- Get proper Claude API key
