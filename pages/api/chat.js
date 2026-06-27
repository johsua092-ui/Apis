import { db } from '../../lib/firebase';
import admin from 'firebase-admin';

const CLAUDE_SESSION_KEY = process.env.CLAUDE_SESSION_KEY;

async function sendToClaude(messages) {
  const lastMessage = messages[messages.length - 1].content;
  
  const response = await fetch('https://claude.ai/api/organizations/*/chat_conversations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `sessionKey=${CLAUDE_SESSION_KEY}`,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    body: JSON.stringify({
      uuid: crypto.randomUUID(),
      name: '',
      summary: ''
    })
  });

  const conversation = await response.json();
  const conversationId = conversation.uuid;

  const msgResponse = await fetch(`https://claude.ai/api/organizations/*/chat_conversations/${conversationId}/completion`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `sessionKey=${CLAUDE_SESSION_KEY}`,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    body: JSON.stringify({
      prompt: lastMessage,
      timezone: 'UTC',
      attachments: []
    })
  });

  const reader = msgResponse.body.getReader();
  const decoder = new TextDecoder();
  let fullResponse = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter(line => line.trim());
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = JSON.parse(line.slice(6));
        if (data.completion) fullResponse += data.completion;
      }
    }
  }

  return {
    id: conversationId,
    type: 'message',
    role: 'assistant',
    content: [{ type: 'text', text: fullResponse }],
    model: 'claude-3-opus',
    stop_reason: 'end_turn',
    usage: { input_tokens: 0, output_tokens: 0 }
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = req.headers.authorization?.replace('Bearer ', '');
  
  if (!apiKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const keyDoc = await db.collection('api_keys').doc(apiKey).get();
    
    if (!keyDoc.exists || !keyDoc.data().active) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    const data = await sendToClaude(req.body.messages);

    await db.collection('api_keys').doc(apiKey).update({
      lastUsed: new Date(),
      usage: admin.firestore.FieldValue.increment(1)
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
