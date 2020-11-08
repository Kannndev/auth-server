const pathToRegexp = require('path-to-regexp');

const tokenService = require('../service/token.service');
const userService = require('../service/user.service');

const whitelistUrls = {
  '/auth/(.*)': '*', // if you want to allow only certain methods ['GET', POST] add it like this and validate
};
const validateToken = async (req, res, next) => {
  // if it is a whitelisted url skipping the token check
  const route = req.originalUrl.split('?')[0];
  for (const [pattern, methods] of Object.entries(whitelistUrls)) {
    const match = pathToRegexp.match(pattern, {
      decode: decodeURIComponent,
    });
    if (match(route) && (methods === '*' || methods.includes(req.req.method))) {
      return next();
    }
  }

  const token = req.get('x-auth-token');
  if (!token) {
    return res
      .status(401)
      .json({ message: 'Access denied, Auth token is missing!' });
  }

  // if token is not present in redis
  if (!(await tokenService.isActiveToken(token))) {
    return res
      .status(401)
      .json({ message: 'Token has been revoked, Please try again' });
  }
  try {
    const payload = await tokenService.validateAccessToken(token);
    // Always making call to db to fetch the latest user info.
    req.user = await userService.getUserInfo(payload.user._id);
    next();
  } catch (err) {
    const errorResponseMap = {
      TokenExpiredError: 'Session timed out, please login again',
      JsonWebTokenError: 'Invalid token!',
    };
    if (errorResponseMap[err.name]) {
      return res.status(401).json({ message: errorResponseMap[err.name] });
    } else {
      console.error(err);
      return res.status(400).json({ error: err });
    }
  }
};

module.exports = validateToken;
