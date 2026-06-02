import fetch from 'node-fetch';

async function run() {
  try {
    // 1. Get a token (We will create a dummy user or just hit the dashboard to see if an endpoint fails).
    // Actually, we can just verify the limit property without JWT if we don't have a token.
    // Let's send a 11MB string to the /api/farms endpoint. Since we don't have a token, it will return 401 Unauthorized.
    // BUT if the payload is too large, it might return 413 Payload Too Large BEFORE hitting auth!
    
    const largeString = 'A'.repeat(11 * 1024 * 1024);
    console.log('Sending large payload...');
    const res = await fetch('http://localhost:3000/api/farms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test', location: 'Test', image: largeString })
    });
    
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Body:', text);
  } catch (err) {
    console.error(err);
  }
}

run();
