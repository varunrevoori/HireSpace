require('dotenv').config();
const express = require('express');
const axios = require('axios');
const router = express.Router();

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
  console.error("❌ Missing GitHub OAuth environment variables. Please set them in .env");
}

// ✅ GitHub OAuth Login Route
router.get('/github', (req, res) => {
  if (!GITHUB_CLIENT_ID) {
    return res.status(500).json({ success: false, message: "GitHub Client ID is missing" });
  }

  const redirectUri = encodeURIComponent(`${process.env.BASE_URL}/auth/github/callback`);
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=user,repo`;
  
  res.redirect(githubAuthUrl);
});

// ✅ GitHub OAuth Callback
router.get('/github/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ success: false, message: "Authorization code is missing" });
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: 'application/json' } }
    );

    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
      return res.status(500).json({ success: false, message: "Failed to retrieve access token" });
    }

    // Fetch user details using the access token
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const userData = userResponse.data;

    // You can store accessToken in DB or session storage
    return res.json({
      success: true,
      accessToken,
      user: {
        id: userData.id,
        login: userData.login,
        name: userData.name,
        avatar_url: userData.avatar_url,
        bio: userData.bio,
        public_repos: userData.public_repos,
      },
    });

  } catch (error) {
    console.error("GitHub OAuth Error:", error.response?.data || error.message);
    return res.status(500).json({ success: false, message: "GitHub authentication failed", error: error.message });
  }
});

module.exports = router;
