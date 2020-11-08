const express = require('express');
const app = express();

const userService = require('../service/user.service');

const myInfo = (req, res, next) => {
  res.status(200).json({ data: req.user });
};

const getUsersList = async (req, res, next) => {
  const response = await userService.getUsersList();
  res.status(200).json({ data: response });
};

app.get('/user/me', myInfo);
app.get('/users', getUsersList);

module.exports = app;
