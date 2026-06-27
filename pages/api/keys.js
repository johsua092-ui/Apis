import { db } from '../../lib/firebase';
import crypto from 'crypto';

export default async function handler(req, res) {
  const adminKey = req.headers['x-admin-key'];
  
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const snapshot = await db.collection('api_keys').get();
    const keys = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      lastUsed: doc.data().lastUsed?.toDate()
    }));
    return res.json(keys);
  }

  if (req.method === 'POST') {
    const newKey = 'sk-' + crypto.randomBytes(24).toString('hex');
    await db.collection('api_keys').doc(newKey).set({
      active: true,
      usage: 0,
      createdAt: new Date(),
      name: req.body.name || 'Unnamed Key'
    });
    return res.json({ key: newKey });
  }

  if (req.method === 'DELETE') {
    const { key } = req.body;
    await db.collection('api_keys').doc(key).delete();
    return res.json({ success: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
