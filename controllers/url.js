const { nanoid } = require("nanoid");
const URL = require('../models/url');

// Create a new short URL
async function handleGenerateNewShortURL(req, res) {
  const body = req.body;

  if (!body.url) {
    return res.status(400).json({ error: 'url is required' });
  }

  const shortID = nanoid(8);

  await URL.create({
    shortId: shortID,
    redirectURL: body.url, // ✅ correct property name
    visitHistory: [],      // ✅ matches schema
    createdBy:req.user._id,
  });

  return res.render("home",{
    id:shortID,
  });
 
}

// Get analytics for a short URL
async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;

  const result = await URL.findOne({ shortId });

  if (!result) {
    return res.status(404).json({ error: "Short URL not found" });
  }

  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};
