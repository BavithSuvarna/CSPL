// backend/src/middleware/adminAuth.js
require('dotenv').config();

module.exports = (req, res, next) => {
  try {
    // Accept token from x-admin-token header OR Authorization: Bearer <token>
    const headerToken = req.headers['x-admin-token'];
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    const bearerToken = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : undefined;

    // Also allow token passed in body or query (handy for testing)
    const bodyToken = req.body && (req.body.admin_token || req.body.token);
    const queryToken = req.query && (req.query.admin_token || req.query.token);

    const token = headerToken || bearerToken || bodyToken || queryToken;

    console.log('[adminAuth] incoming token:', token); // << for debugging

    if (!token) {
      return res.status(401).json({ error: 'Admin token required (send x-admin-token header)' });
    }

    const expected = process.env.ADMIN_TOKEN;
    if (!expected) {
      console.warn('[adminAuth] WARNING: ADMIN_TOKEN not set on server env');
      return res.status(500).json({ error: 'Server misconfiguration: admin token not set' });
    }

    if (token !== expected) {
      console.warn('[adminAuth] invalid token provided');
      return res.status(403).json({ error: 'Invalid admin token' });
    }

    // Token valid
    next();
  } catch (err) {
    console.error('[adminAuth] error', err);
    return res.status(500).json({ error: 'Admin auth error' });
  }
};
