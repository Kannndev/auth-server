const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
});

// Pre save hook that generates salt of 8 rounds and hashes the password.
// The hashed password will contain salt rounds count,  salt and the hashed password
userSchema.pre('save', function (next) {
  try {
    this.password = bcrypt.hashSync(this.password, 8);
  } catch (error) {
    console.error(error);
  }
  return next();
});

module.exports = mongoose.model('User', userSchema);
