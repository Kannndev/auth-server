const authController = require('./controller/auth.controller');
const userController = require('./controller/user.controller');

const registerRoutes = (app) => {
  app.use(authController);
  app.use(userController);
};

module.exports = registerRoutes;
