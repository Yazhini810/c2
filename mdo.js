// HOW TO RUN:
// 1. Install dependencies: npm install express passport passport-auth0 express-session mongodb dropbox multer dotenv
// 2. Create .env file with:
//    AUTH0_DOMAIN=your-domain.auth0.com
//    AUTH0_CLIENT_ID=your-client-id
//    AUTH0_CLIENT_SECRET=your-secret
//    MONGODB_URI=mongodb://localhost:27017
//    DROPBOX_TOKEN=your-dropbox-access-token
// 3. Run: node app.js
// 4. Visit: http://localhost:4000

require('dotenv').config();
const express = require('express');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const session = require('express-session');
const { MongoClient } = require('mongodb');
const { Dropbox } = require('dropbox');
const multer = require('multer');
const upload = multer();

const app = express();
let db;

// Auth0 Setup
passport.use(new Auth0Strategy({
  domain: process.env.AUTH0_DOMAIN,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  callbackURL: 'http://localhost:4000/callback'
}, (token, refresh, extra, profile, done) => done(null, profile)));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.use(session({ secret: 'mysecret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// MongoDB
MongoClient.connect(process.env.MONGODB_URI).then(client => {
  db = client.db('myapp');
  console.log('✓ MongoDB connected');
}).catch(err => console.log('MongoDB error:', err));

// Routes
app.get('/', (req, res) => {
  if (req.user) {
    res.send(`<body style="background:#667eea;color:white;padding:20px;font-family:Arial">
      <h1>Hi ${req.user.displayName}!</h1>
      <a href="/dropbox" style="color:white">Upload to Dropbox</a> | 
      <a href="/logout" style="color:white">Logout</a>
    </body>`);
  } else {
    res.send(`<body style="background:#667eea;color:white;padding:20px;font-family:Arial">
      <h1>Welcome</h1>
      <a href="/login" style="color:white">Login with Auth0</a>
    </body>`);
  }
});

app.get('/login', passport.authenticate('auth0'));

app.get('/callback', passport.authenticate('auth0'), (req, res) => {
  if (db) {
    db.collection('users').insertOne({ 
      name: req.user.displayName, 
      loginDate: new Date() 
    });
  }
  res.redirect('/');
});

app.get('/dropbox', (req, res) => {
  if (!req.user) return res.redirect('/login');
  
  res.send(`<body style="background:#667eea;color:white;padding:20px;font-family:Arial">
    <h1>Upload File to Dropbox</h1>
    <form action="/upload" method="POST" enctype="multipart/form-data">
      <input type="file" name="file" required><br><br>
      <button type="submit">Upload</button>
    </form>
    <br><a href="/" style="color:white">Home</a>
  </body>`);
});

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.user) return res.redirect('/login');
  
  try {
    const dbx = new Dropbox({ accessToken: process.env.DROPBOX_TOKEN });
    await dbx.filesUpload({
      path: '/' + req.file.originalname,
      contents: req.file.buffer
    });
    
    res.send(`<body style="background:#667eea;color:white;padding:20px;font-family:Arial">
      <h1>Success!</h1>
      <p>${req.file.originalname} uploaded</p>
      <a href="/dropbox" style="color:white">Upload Another</a> | 
      <a href="/" style="color:white">Home</a>
    </body>`);
  } catch (error) {
    res.send(`<body style="background:#667eea;color:white;padding:20px;font-family:Arial">
      <h1>Error</h1>
      <p>${error.message}</p>
      <a href="/dropbox" style="color:white">Try Again</a>
    </body>`);
  }
});

app.get('/logout', (req, res) => {
  req.logout(() => res.redirect('/'));
});

app.listen(4000, () => console.log('Server running on http://localhost:4000'));