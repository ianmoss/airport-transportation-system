import express from 'express';
const cors = require('cors');
import jwt from 'jsonwebtoken';
import axios from 'axios';

const app = express();
const PORT = 4000;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type']
}));

app.use(express.json());

// Middleware to simulate token verification
function verifyToken(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers['authorization'];

  if (typeof authHeader !== 'string') {
    return res.status(401).json({ error: 'Invalid authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.decode(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token verification failed' });
  }
}

// Proxy /api/journey to main-api
app.post('/api/journey', verifyToken, async (req, res) => {
  try {
    const response = await axios.post('http://main-api:4001/journey', req.body, {
      headers: {
        Authorization: req.headers.authorization || '',
        'Content-Type': 'application/json',
      }
    });

    return res.json(response.data);
  } catch (err: any) {
    console.error('Error proxying to main-api:', err.message);
    return res.status(500).json({ error: 'Failed to fetch journey info from main-api' });
  }
});

// Health check
app.get('/health', (_req, res) => res.send('API Gateway is healthy!'));

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
