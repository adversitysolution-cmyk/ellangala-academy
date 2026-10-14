import assert from 'node:assert/strict';

process.env.PORT = '0';
process.env.ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@ellangala.com';
process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'test-admin-pass';

const { default: app } = await import('./index.js');
const { ensureCommunitySchema } = await import('./db/communityStore.js');

async function runAuthTests() {
  console.log('══════════════════════════════════════════════════════════════════');
  console.log('   COMMUNITY USER AUTH & 30-DAY PERSISTENT SESSIONS TEST SUITE   ');
  console.log('══════════════════════════════════════════════════════════════════\n');

  await ensureCommunitySchema();

  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api`;

  try {
    // TEST 1: Signup with required fields (Name, Phone, Password) and optional Email + Topics
    console.log('▶ Test 1: Community user registration with 30-day session token');
    const testPhone = '+91 98765 43210';
    const testName = 'Rohan Deshmukh';
    const testPass = 'mindfulPass123';
    const testEmail = 'rohan@example.com';
    const testTopics = ['Mindfulness & Meditation', 'Positive Psychology'];

    const signupRes = await fetch(`${baseUrl}/community/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: testName,
        phone: testPhone,
        email: testEmail,
        password: testPass,
        topics: testTopics
      })
    });

    assert.equal(signupRes.status, 201, 'Signup must return 201 Created');
    const signupData = await signupRes.json();
    assert.ok(signupData.user, 'User object must be returned');
    assert.equal(signupData.user.name, testName);
    assert.ok(signupData.token, 'Session token must be provided');
    assert.ok(signupData.tokenExpiresAt, 'tokenExpiresAt must be provided');

    // Verify 30-day expiration window (~30 days = 2592000000 ms)
    const expiresMs = new Date(signupData.tokenExpiresAt).getTime() - Date.now();
    const days = expiresMs / (1000 * 60 * 60 * 24);
    assert.ok(days >= 29 && days <= 31, `Session expiry must be ~30 days (got ${days.toFixed(1)} days)`);
    console.log(`  ✅ Successfully registered user "${testName}" with 30-day session token.`);

    // TEST 2: Reject duplicate registration with same mobile number
    console.log('▶ Test 2: Duplicate mobile number rejection');
    const dupRes = await fetch(`${baseUrl}/community/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Another User',
        phone: testPhone,
        password: 'anotherPassword'
      })
    });
    assert.equal(dupRes.status, 400, 'Duplicate phone should be rejected with 400');
    console.log('  ✅ Duplicate mobile number successfully rejected.');

    // TEST 3: Login with Mobile Number
    console.log('▶ Test 3: Member login using Mobile Number + Password');
    const loginPhoneRes = await fetch(`${baseUrl}/community/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: '9876543210', // Raw digits without spaces
        password: testPass
      })
    });
    assert.equal(loginPhoneRes.status, 200, 'Login with phone should return 200');
    const loginPhoneData = await loginPhoneRes.json();
    assert.equal(loginPhoneData.user.name, testName);
    assert.ok(loginPhoneData.token, 'New or refreshed token returned');
    console.log('  ✅ Logged in successfully with mobile number.');

    // TEST 4: Login with Name
    console.log('▶ Test 4: Member login using Name + Password');
    const loginNameRes = await fetch(`${baseUrl}/community/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'rohan deshmukh', // Case-insensitive
        password: testPass
      })
    });
    assert.equal(loginNameRes.status, 200, 'Login with name should return 200');
    const loginNameData = await loginNameRes.json();
    assert.equal(loginNameData.user.name, testName);
    console.log('  ✅ Logged in successfully with user name.');

    // TEST 5: Reject invalid password
    console.log('▶ Test 5: Rejection of invalid password');
    const badPassRes = await fetch(`${baseUrl}/community/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: testPhone,
        password: 'wrongPassword99'
      })
    });
    assert.equal(badPassRes.status, 401, 'Invalid password must return 401 Unauthorized');
    console.log('  ✅ Invalid password correctly rejected.');

    // TEST 6: Session validation via /api/community/auth/me
    console.log('▶ Test 6: Session persistence verification via GET /api/community/auth/me');
    const meRes = await fetch(`${baseUrl}/community/auth/me`, {
      headers: { Authorization: `Bearer ${loginNameData.token}` }
    });
    assert.equal(meRes.status, 200, 'GET /me must return 200 for valid token');
    const meData = await meRes.json();
    assert.equal(meData.user.name, testName);
    assert.deepEqual(meData.user.topics, testTopics);
    console.log('  ✅ Session verified with matching user topics.');

    // TEST 7: My Learning endpoint
    console.log('▶ Test 7: Registered courses retrieval via GET /api/community/user/learning');
    const learnRes = await fetch(`${baseUrl}/community/user/learning`, {
      headers: { Authorization: `Bearer ${loginNameData.token}` }
    });
    assert.equal(learnRes.status, 200, 'Learning endpoint must return 200');
    const learnData = await learnRes.json();
    assert.ok(Array.isArray(learnData.enrolledCourses), 'Enrolled courses array must exist');
    assert.ok(learnData.enrolledCourses.length > 0, 'Enrolled courses must have active courses');
    console.log(`  ✅ Retrieved ${learnData.enrolledCourses.length} enrolled courses with progress.`);

    // TEST 8: Workshops endpoint
    console.log('▶ Test 8: Enrolled workshops retrieval via GET /api/community/user/workshops');
    const wsRes = await fetch(`${baseUrl}/community/user/workshops`, {
      headers: { Authorization: `Bearer ${loginNameData.token}` }
    });
    assert.equal(wsRes.status, 200, 'Workshops endpoint must return 200');
    const wsData = await wsRes.json();
    assert.ok(Array.isArray(wsData.enrolledEvents), 'Enrolled workshops array must exist');
    console.log(`  ✅ Retrieved ${wsData.enrolledEvents.length} enrolled workshops.`);

    // TEST 9: Logout endpoint
    console.log('▶ Test 9: Logout & session invalidation via POST /api/community/auth/logout');
    const logoutRes = await fetch(`${baseUrl}/community/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${loginNameData.token}` }
    });
    assert.equal(logoutRes.status, 200, 'Logout must return 200');

    // Verify token no longer accepted
    const meAfterLogout = await fetch(`${baseUrl}/community/auth/me`, {
      headers: { Authorization: `Bearer ${loginNameData.token}` }
    });
    assert.equal(meAfterLogout.status, 401, 'Logged out token must return 401');
    console.log('  ✅ Logout successfully cleared session.');

    console.log('\n══════════════════════════════════════════════════════════════════');
    console.log('   ALL 9 COMMUNITY USER AUTH TESTS PASSED PERFECTLY!              ');
    console.log('══════════════════════════════════════════════════════════════════\n');
  } finally {
    server.close();
  }
}

runAuthTests().catch((err) => {
  console.error('❌ Community Auth Tests Failed:', err);
  process.exit(1);
});
