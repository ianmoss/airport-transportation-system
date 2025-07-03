import React from 'react';
import ReactDOM from 'react-dom/client';

import JourneyPlanner from './components/JourneyPlanner';

function base64UrlEncode(obj: object) {
  return btoa(JSON.stringify(obj))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function createDemoJWT() {
  const header = { alg: 'none', typ: 'JWT' };
  const payload = {
    sub: 'user123',
    name: 'Demo User',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  };

  return `${base64UrlEncode(header)}.${base64UrlEncode(payload)}.`;
}

const demoToken = createDemoJWT(); // Unsigned token for demo purposes

const App = () => (
  <div>
    <h1>Host App</h1>
    <p>Below is the shared UI component.</p>
    <p>The component gets the username from the authorization token.</p>
    <p>It has a form which requires the start address of aitport journey. the flight number and the flight date.</p>
    <p>On submitting calls the api -gateway, which it verifies the authorization token and calls the main api to get the journey info.</p>
    <div>
      <JourneyPlanner token={demoToken} />
    </div>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
