import React, { useState } from 'react';

interface JourneyPlannerProps {
  token: string;
}

interface FlightInfo {
  recommendedDepartureTime: string;
  estimatedArrivalTime: string;
  departureAirport: string;
  arrivalAirport: string;
  priorityPassLounge: string;
  taxiAvailable: boolean;
  estimatedTaxiDuration: string;
}

const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

const decodeTokenName = (token: string): string | null => {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    const parsed = JSON.parse(decoded);
    return parsed.name || null;
  } catch {
    return null;
  }
};

const JourneyPlanner: React.FC<JourneyPlannerProps> = ({ token }) => {
  const [flightNumber, setFlightNumber] = useState('');
  const [flightDate, setFlightDate] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<FlightInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const userName = decodeTokenName(token) || 'Guest';

  const fetchJourneyInfo = async () => {
    setLoading(true);
    setError(null);
    setInfo(null);

    try {
      const response = await fetch('http://localhost:4000/api/journey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ flightNumber, flightDate, address }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setInfo(data);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (flightNumber && flightDate && address) {
      fetchJourneyInfo();
    }
  };

  return (
    <div style={{ padding: '1rem', fontFamily: 'Arial, sans-serif', maxWidth: 500 }}>
      <h2>Journey Planner</h2>
      <p>Welcome, {userName}</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Start of Journey Address:
            <br />
            <textarea
              value={address}
              onChange={e => setAddress(e.target.value)}
              required
              placeholder="123 Main St, New York, NY"
              rows={3}
              style={{ width: '100%', marginTop: 4 }}
            />
          </label>
        </div>
        <div style={{ marginTop: '0.75rem' }}>
          <label>
            Flight Number:
            <input
              type="text"
              value={flightNumber}
              onChange={e => setFlightNumber(e.target.value.toUpperCase())}
              required
              style={{ marginLeft: 8 }}
            />
          </label>
        </div>
        <div style={{ marginTop: '0.75rem' }}>
          <label>
            Flight Date:
            <input
              type="date"
              value={flightDate}
              onChange={e => setFlightDate(e.target.value)}
              required
              style={{ marginLeft: 8 }}
            />
          </label>
        </div>
        <button type="submit" style={{ marginTop: '1rem' }} disabled={loading}>
          {loading ? 'Loading...' : 'Get Journey Info'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {info && (
        <div style={{ marginTop: '1rem', backgroundColor: '#f0f0f0', padding: '1rem' }}>
          <p><strong>Start of Journey:</strong> {address}</p>
          <p><strong>To:</strong> {info.departureAirport} → {info.arrivalAirport}</p>
          <p><strong>Recommended Departure:</strong> {formatDateTime(info.recommendedDepartureTime)}</p>
          <p><strong>Estimated Arrival:</strong> {formatDateTime(info.estimatedArrivalTime)}</p>
          <p><strong>Lounge:</strong> {info.priorityPassLounge}</p>
          <p><strong>Taxi Available:</strong> {info.taxiAvailable ? 'Yes' : 'No'}</p>
          {info.estimatedTaxiDuration && (
            <p><strong>Estimated Taxi Time:</strong> {info.estimatedTaxiDuration}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default JourneyPlanner;
