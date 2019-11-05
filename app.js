const config = require("./utils/config");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const loginRouter = require("./controllers/login");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const middleware = require("./utils/middleware");
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const app = express();

logger.info("connecting to", config.MONGODB_URI);
try {
  const mongooseConnect = async () => {
    const connection = await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    if (connection) {
      logger.info("connected to MONGODB");
    }
  };
  mongooseConnect();
} catch (error) {
  logger.error("error connecting to MONGODB", error.message);
}

app.use(cors());
app.use(express.static("build"));
app.use(bodyParser.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

app.use("/api/login", loginRouter);
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
