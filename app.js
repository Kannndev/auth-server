require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const registerRoutes = require('./app.routes');
const registerMiddlewares = require('./app.middlewares');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log('Mongo db connected!'))
  .catch((err) => console.error(err));

registerMiddlewares(app); // registering all our middlewares
registerRoutes(app); // registering all our routes

//error handler
app.use((err, req, res, next) => {
  console.log(err);
  const { error, code, message } = err;
  res.status(code || 500).json({ message, error });
});

app.listen(port, () => {
  console.log('Server is running at ', port);
});

process
  .on('warning', (reason) => {
    console.warn(reason);
  })
  .on('unhandledRejection', (reason, p) => {
    console.error(reason.toString());
  })
  .on('uncaughtException', (err) => {
    console.error(err.toString());
    process.exit(1);
  });
