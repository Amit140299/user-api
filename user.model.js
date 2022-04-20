const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: crypto.randomBytes(16).toString('hex'),
  },
  username: {
    type: String,
    unique: true,
    required: [
      true,
      'Please add a valid username. Username should contain only alphabets',
    ],
  },
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add a valid email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a Password'],
    minlength: 6,
    select: false,
  },
  mobile: {
    type: String,
    minlength: 10,
    required: [true, 'Please add a valid mobile number'],
  },
  address: {
    type: String,
    required: [true, 'Please add a valid address'],
  },
});

// Middleware - Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database - (is a method)
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
