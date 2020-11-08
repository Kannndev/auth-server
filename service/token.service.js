const jwt = require('jsonwebtoken');

const redis = require('./redis.service');
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

const createAccessToken = async (userId) => {
  let accessToken = jwt.sign({ user: { _id: userId } }, ACCESS_TOKEN_SECRET, {
    expiresIn: '60m',
  });
  await redis.set(accessToken, true);
  return accessToken;
};

const createRefreshToken = async (userId) => {
  let refreshToken = jwt.sign({ user: { _id: userId } }, REFRESH_TOKEN_SECRET, {
    expiresIn: '1d',
  });
  await redis.set(refreshToken, true);
  return refreshToken;
};

const isActiveToken = async (token) => {
  return redis.get(token);
};

const validateAccessToken = async (token) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
};

const validateRefreshToken = async (token) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  isActiveToken,
  validateAccessToken,
  validateRefreshToken,
};
