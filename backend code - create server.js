const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Database
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Sample User Model
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});
const User = mongoose.model('User', UserSchema);

// Routes
app.get('/', (req, res) => {
  res.send('MaidLink backend is running');
});

app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  const user = new User({ name, email, password });
  await user.save();
  res.status(201).json({ message: 'User registered!' });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) return res.json({ message: 'Login successful', user });
  res.status(401).json({ message: 'Invalid credentials' });
});

// Start Server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
