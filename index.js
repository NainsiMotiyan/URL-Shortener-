const express = require("express");
const path=require('path')
const cookieParser=require('cookie-parser')
const { connectToMongoDB } = require("./connect");
const {restrictTo,checkAuth, checkForAuthentication}=require('./middlewares/auth')

const URL = require('./models/url');
const urlRoute = require("./routes/url");
const staticRoute=require("./routes/staticRouter");
const userRoute=require('./routes/user');
const app = express();
const PORT = 8001;

// Connect to MongoDB
connectToMongoDB("mongodb://localhost:27017/short-url")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

  app.set('view engine',"ejs");
  app.set('views',path.resolve("./views"));
// Middleware
app.use(express.json());

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthentication);


// Routes for creating short URLs
app.use("/url",restrictTo(["NORMAL"]) ,urlRoute);
app.use("/user", userRoute);
app.use('/',staticRoute);


// Route for redirecting to original URL
app.get('/url/:shortId', async (req, res) => {
  const { shortId } = req.params;

  const entry = await URL.findOneAndUpdate(
    { shortId },
    {
      $push: { visitHistory: { timestamp: Date.now() } }
    }
  );

  if (!entry) {
    return res.status(404).json({ error: "Short URL not found" });
  }

  res.redirect(entry.redirectURL);
});

// Start server
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
