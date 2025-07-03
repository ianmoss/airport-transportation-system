import express from 'express';

const app = express();
app.use(express.json());

app.get('/health', (_, res) => res.send('✅ Service running'));

app.post('/journey', (req, res) => {
  const { flightNumber, flightDate, address } = req.body;

  if (!flightNumber || !flightDate || !address) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const mockResponse = {
    flightNumber,
    departureAirport: 'JFK',
    arrivalAirport: 'LHR',
    recommendedDepartureTime: '2025-07-02T14:00:00Z',
    estimatedArrivalTime: '2025-07-02T15:00:00Z',
    taxiAvailable: true,
    estimatedTaxiDuration: '45 minutes',
    priorityPassLounge: 'Terminal 4 Lounge',
    originAddress: address,
  };

  res.json(mockResponse);
});

app.listen(4001, () => {
  console.log('🚀 Main API running at http://localhost:4001');
});
