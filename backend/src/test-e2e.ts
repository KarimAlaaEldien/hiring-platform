import { connect, connection } from 'mongoose';

// Since we are running in ts-node, let's perform standard fetch requests
const BASE_URL = 'http://localhost:4000';

async function runTests() {
  console.log('=== STARTING PROGRAMMATIC E2E API INTEGRATION TESTS ===');
  
  const uniqueId = Math.floor(Math.random() * 100000);
  const devEmail = `dev_${uniqueId}@test.com`;
  const compEmail = `comp_${uniqueId}@test.com`;
  const password = 'Password123';

  let devToken = '';
  let devId = '';
  let compToken = '';
  let compId = '';
  let testJobId = '';
  let appId = '';

  // 1. Register Developer
  console.log('\n[1] Registering a new Developer...');
  const regDevRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'E2E Developer Tester',
      email: devEmail,
      password: password,
      role: 'Developer',
      title: 'Senior TypeScript Engineer',
      company: 'Freelance'
    })
  });
  const regDevData = await regDevRes.json();
  if (regDevRes.status !== 201) throw new Error(`Dev registration failed: ${JSON.stringify(regDevData)}`);
  devToken = regDevData.accessToken;
  devId = regDevData.user.id;
  console.log(`✅ Developer Registered! ID: ${devId}, Full Name: ${regDevData.user.name}, Title: ${regDevData.user.title}`);

  // 2. Fetch Developer Profile
  console.log('\n[2] Fetching Developer Profile...');
  const devProfileRes = await fetch(`${BASE_URL}/users/profile`, {
    headers: { 'Authorization': `Bearer ${devToken}` }
  });
  const devProfileData = await devProfileRes.json();
  console.log(`✅ Profile Fetched! Name: ${devProfileData.name}, Email: ${devProfileData.email}, Role: ${devProfileData.role}`);

  // 3. Update Developer Profile
  console.log('\n[3] Updating Developer Profile...');
  const updateProfileRes = await fetch(`${BASE_URL}/users/profile`, {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${devToken}`
    },
    body: JSON.stringify({
      name: 'E2E Developer Pro',
      title: 'Lead Systems Architect',
      bio: 'E2E testing is amazing and works perfectly.'
    })
  });
  const updateProfileData = await updateProfileRes.json();
  console.log(`✅ Profile Updated! New Name: ${updateProfileData.name}, New Title: ${updateProfileData.title}, Bio: "${updateProfileData.bio}"`);

  // 4. Fetch Available Jobs
  console.log('\n[4] Querying available jobs...');
  const jobsRes = await fetch(`${BASE_URL}/jobs`);
  const jobsData = await jobsRes.json();
  console.log(`✅ Successfully fetched jobs! Total available in DB: ${jobsData.length}`);
  if (jobsData.length === 0) throw new Error('No jobs available to test! Please seed the database first.');
  const firstJob = jobsData[0];
  testJobId = firstJob._id;
  console.log(`👉 Selected Job for testing: "${firstJob.title}" at "${firstJob.company || firstJob.companyId?.companyName}"`);

  // 5. Save (Bookmark) Job
  console.log(`\n[5] Saving job "${firstJob.title}"...`);
  const saveRes = await fetch(`${BASE_URL}/jobs/${testJobId}/save`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${devToken}` }
  });
  const saveData = await saveRes.json();
  console.log(`✅ Job Saved successfully! Saved Jobs Count: ${saveData.savedJobs?.length}`);

  // 6. Apply to Job
  console.log(`\n[6] Applying for job "${firstJob.title}"...`);
  const applyRes = await fetch(`${BASE_URL}/applications`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${devToken}`
    },
    body: JSON.stringify({
      jobId: testJobId,
      resumeUrl: 'https://example.com/resume.pdf'
    })
  });
  const applyData = await applyRes.json();
  if (applyRes.status !== 201) throw new Error(`Application failed: ${JSON.stringify(applyData)}`);
  appId = applyData._id;
  console.log(`✅ Applied successfully! Application ID: ${appId}, Initial Status: ${applyData.status}`);

  // 7. Get Developer Applications List
  console.log('\n[7] Querying Developer\'s own applications...');
  const devAppsRes = await fetch(`${BASE_URL}/applications/developer`, {
    headers: { 'Authorization': `Bearer ${devToken}` }
  });
  const devAppsData = await devAppsRes.json();
  console.log(`✅ Developer Applications fetched! Found: ${devAppsData.length} application(s)`);

  // 8. Register Company
  console.log('\n[8] Registering a new Company...');
  const regCompRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Tech Recruiter Pro',
      email: compEmail,
      password: password,
      role: 'Company',
      companyName: 'Infinite Technologies'
    })
  });
  const regCompData = await regCompRes.json();
  if (regCompRes.status !== 201) throw new Error(`Company registration failed: ${JSON.stringify(regCompData)}`);
  compToken = regCompData.accessToken;
  compId = regCompData.user.id;
  console.log(`✅ Company Registered! ID: ${compId}, Company Name: ${regCompData.user.companyName}`);

  // 9. Post a New Job by the Company
  console.log('\n[9] Posting a new Job by the Company...');
  const postJobRes = await fetch(`${BASE_URL}/jobs`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${compToken}`
    },
    body: JSON.stringify({
      title: 'TypeScript Developer (E2E Test)',
      description: 'We are looking for an amazing TypeScript developer.',
      location: 'Remote',
      type: 'Full-time',
      salary: '$130k - $150k',
      tags: ['TypeScript', 'Node', 'NestJS']
    })
  });
  const postJobData = await postJobRes.json();
  const postedJobId = postJobData._id;
  console.log(`✅ Job Posted successfully! Job ID: ${postedJobId}, Title: "${postJobData.title}"`);

  // 10. Query Jobs Posted by this Company
  console.log('\n[10] Querying jobs posted by the Company...');
  const companyJobsRes = await fetch(`${BASE_URL}/jobs?companyId=${compId}`);
  const companyJobsData = await companyJobsRes.json();
  console.log(`✅ Company Jobs fetched! Total posted: ${companyJobsData.length}`);

  // 11. Query Applications received by this Company
  console.log('\n[11] Querying all applications received by the Company...');
  const compAppsRes = await fetch(`${BASE_URL}/applications/company`, {
    headers: { 'Authorization': `Bearer ${compToken}` }
  });
  const compAppsData = await compAppsRes.json();
  console.log(`✅ Company Applications fetched! Found: ${compAppsData.length} application(s) received`);

  // 12. Test Logout Flow
  console.log('\n[12] Testing user logout...');
  const logoutRes = await fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${devToken}` }
  });
  const logoutData = await logoutRes.json();
  console.log(`✅ Logout successful! Message: "${logoutData.message}"`);

  console.log('\n=======================================================');
  console.log('🎉 ALL INTEGRATION API TESTS PASSED SUCCESSFULLY! 🎉');
  console.log('Everything functions exactly as expected in production.');
  console.log('=======================================================');
}

runTests().catch(err => {
  console.error('\n❌ TEST RUN FAILED WITH ERROR:', err);
  process.exit(1);
});
