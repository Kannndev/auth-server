const bcrypt = require('bcryptjs');

const User = require('../model/user.model');
const tokenService = require('./token.service');

const signup = async ({ email, password, name }) => {
  //check if email is already registered:
  let user = await User.findOne({ email: email });
  if (user) {
    throw {
      code: 400,
      message: 'Email already registered. Please login!',
    };
  } else {
    user = await new User({ email, password, name }).save();
    let accessToken = await tokenService.createAccessToken(user._id.toString());
    let refreshToken = await tokenService.createRefreshToken(
      user._id.toString()
    );

    return {
      _id: user._id,
      email: user.email,
      name: user.name,
      accessToken,
      refreshToken,
    };
  }
};

const login = async ({ email, password }) => {
  let user = await User.findOne({ email });
  if (!user) {
    throw { code: 404, message: 'User not found' };
  } else {
    let valid = await bcrypt.compare(password, user.password);
    if (valid) {
      let accessToken = await tokenService.createAccessToken(
        user._id.toString()
      );
      let refreshToken = await tokenService.createRefreshToken(
        user._id.toString()
      );

      return {
        _id: user._id,
        email: user.email,
        name: user.name,
        accessToken,
        refreshToken,
      };
    }
    throw { code: 401, message: 'Invalid password!' };
  }
};

const refreshToken = async ({ token }) => {
  const isTokenActive = await tokenService.isActiveToken(token);
  if (!isTokenActive) {
    throw {
      code: 401,
      message: 'Refersh Token has been revoked. Please login again',
    };
  }
  try {
    const payload = await tokenService.validateRefreshToken(token);
    const accessToken = await tokenService.createAccessToken(payload.user._id);
    return { accessToken };
  } catch (err) {
    const errorResponseMap = {
      TokenExpiredError: 'Refresh token expired, Please login again',
      JsonWebTokenError: 'Invalid token!',
    };
    if (errorResponseMap[err.name]) {
      throw { code: 401, message: errorResponseMap[err.name] };
    } else {
      console.error(err);
      throw { code: 500, error: err };
    }
  }
};

const getUserInfo = async (userId) => {
  const userProjection = {
    password: false,
  };
  return User.findById(userId, userProjection);
};

const getUsersList = async () => {
  const userProjection = {
    password: false,
  };
  return User.find({}, userProjection);
};

module.exports = {
  signup,
  login,
  refreshToken,
  getUserInfo,
  getUsersList,
};
