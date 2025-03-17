const axios = require('axios');
const express = require('express');
const router = express.Router();

// Ensure required environment variables are set
const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
  console.error("❌ Missing GitHub OAuth environment variables");
}

// Redirect to GitHub OAuth login
router.get('/github', (req, res) => {
  if (!GITHUB_CLIENT_ID) {
    return res.status(500).json({ success: false, message: "GitHub Client ID is missing" });
  }

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=repo,user`;
  res.redirect(githubAuthUrl);
});

// GitHub OAuth Callback
router.get('/github/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ success: false, message: "Authorization code is missing" });
  }

  try {
    // Exchange code for GitHub Access Token
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: 'application/json' } }
    );

    if (!response.data.access_token) {
      return res.status(500).json({ success: false, message: "Failed to retrieve access token" });
    }

    const accessToken = response.data.access_token;
    return res.json({ success: true, accessToken });
  } catch (error) {
    console.error("GitHub OAuth Error:", error.response?.data || error.message);
    return res.status(500).json({ success: false, message: "GitHub authentication failed", error: error.message });
  }
});

module.exports = router;
