const authMiddleware = require('./middleware/auth.middleware');

const registerMiddlewares = (app) => {
  app.use(authMiddleware);
};

module.exports = registerMiddlewares;
