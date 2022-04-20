const express = require('express');
const User = require('./user.model');
const connectDB = require('./db');
const sendEmail = require('./sendEmail');

const PORT = 5000;

const app = express();
app.use(express.json());
connectDB();

/*
________________________________
    ROUTE DETAILS OVERVIEW
________________________________

    1. GET   /users      => Get all users
    2. POST  /register   => Create a user
    3. POST  /login      => Log in the user
    4. POST  /purge      => Clear database

*/

// Get all users
app.get('/users', async (req, res) => {
  const users = await User.find();
  res.status(200).json({ success: true, count: users.length, data: users });
});

// Register the user
app.post('/register', async (req, res) => {
  try {
    const user = await User.create(req.body);
    console.log(user);

    if (user) {
      const message = '<h1>Welcome to this application<h1>';
      try {
        await sendEmail({
          email: user.email,
          subject: 'Welcome User',
          message,
        });

        // Send JSON
        res.status(200).json({ success: true, msg: 'Email sent', data: user });
      } catch (err) {
        console.log(err);
        res.status(200).json({ success: false, msg: err });
      }
    }
  } catch (err) {
    res.status(200).json({ success: false, msg: err });
  }
});

// Login the user
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      res
        .status(404)
        .json({ success: false, msg: 'Wrong username or password' });
    } else {
      res
        .status(200)
        .json({ success: true, msg: 'Successfully Logged In', data: user });
    }
  } catch (err) {
    res.json({ success: false, msg: err });
  }
});

// Clear the database
app.post('/purge', async (req, res) => {
  const users = await User.deleteMany();
  res.status(200).json({ success: true, data: users });
});

// Start port and listen
app.listen(PORT, () => {
  console.log(`Server Started on PORT ${PORT}`);
});
