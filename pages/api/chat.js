import { db } from '../../lib/firebase';
import admin from 'firebase-admin';

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

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();

    await db.collection('api_keys').doc(apiKey).update({
      lastUsed: new Date(),
      usage: admin.firestore.FieldValue.increment(1)
    });

    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
