async function testGeneration() {
  try {
    // 1. Register a test user
    const email = `testuser_${Date.now()}@example.com`;
    let res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: email,
        password: 'password123'
      })
    });
    let data = await res.json();
    if (!res.ok) throw new Error("Auth failed: " + JSON.stringify(data));
    const token = data.token;
    console.log("Token acquired:", token.substring(0, 10) + '...');

    // 2. Call generate questions
    console.log("Calling generate...");
    res = await fetch('http://localhost:5000/api/interviews/generate', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({
        role: 'React Developer',
        difficulty: 'Medium',
        count: 5
      })
    });

    data = await res.json();
    if (!res.ok) {
        console.error("API Error Response:", res.status, data);
    } else {
        console.log("Success! Data:", data);
    }

  } catch (err) {
    console.error("Fetch/Runtime error:", err);
  }
}

testGeneration();
