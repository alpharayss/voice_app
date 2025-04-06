const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const crypto = require('crypto');

// ✅ Fixed static salt like frontend
const STATIC_SALT = 'yourSecretSaltHere';

// ✅ Hash function same as frontend
const hashPassword = (plainPassword, email) => {
  const combined = plainPassword + STATIC_SALT + email;
  return crypto.createHash('sha256').update(combined).digest('hex');
};

// SIGN UP
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  // Check if user exists
  const { data: existingUser, error: checkError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (checkError) {
    console.error('Error checking user existence:', checkError);
    return res.status(500).json({ error: 'Failed to check user existence' });
  }

  if (existingUser) {
    return res.status(409).json({ error: 'User already exists with this email' });
  }

  const hashedPassword = hashPassword(password, email);

  const { error: insertError } = await supabase.from('users').insert([
    {
      name,
      email,
      password: hashedPassword,
      roomid: 6787, // Hardcoded roomid
    },
  ]);

  if (insertError) {
    console.error('Signup error:', insertError);
    return res.status(500).json({ error: 'Failed to create user' });
  }

  return res.status(201).json({ message: 'Account created successfully' });
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const hashed = hashPassword(password, email);

  console.log('Attempting login for email:', email, 'hashed password:', hashed); // Debug log

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .eq('password', hashed)
    .single();

  if (error) {
    console.error('Login query error:', error);
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  if (!data) {
    console.log('No user found with email:', email); // Debug log
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Return detailed user data including roomid
  const userResponse = {
    id: data.id,
    name: data.name,
    email: data.email,
    roomid: data.roomid || null, // Ensure roomid is included
  };

  console.log('Login successful for user:', userResponse); // Debug log

  return res.status(200).json({ 
    message: 'Login successful', 
    user: userResponse 
  });
});

module.exports = router;