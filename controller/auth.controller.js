const express = require('express');
const app = express();

const userService = require('../service/user.service');

const signup = async (req, res, next) => {
  try {
    const response = await userService.signup(req.body);
    res.status(200).json({ data: response });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const response = await userService.login(req.body);
    res.status(200).json({ data: response });
  } catch (err) {
    next(err);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const response = await userService.refreshToken(req.query);
    res.status(200).json({ data: response });
  } catch (err) {
    next(err);
  }
};

app.post('/auth/signup', signup);
app.post('/auth/login', login);
app.get('/auth/refresh-token', refreshToken);

module.exports = app;
