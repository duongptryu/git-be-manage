const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { models } = require("./db");
const { logger } = require("./helpers/logger");

const { userRouters } = require("./routes/user.route");
const { authRoute } = require("./routes/auth.route");

const prefixApi = "/api/v1";

const main = async () => {
  const app = express();

  // Dotenv config
  dotenv.config();

  // App Config
  app.use(cors());
  app.use(express.json());

  app.get("/", function (req, res) {
    res.send("Hello World 123s");
  });

  // APIs Routes
  app.use(prefixApi + "/user", userRouters);
  app.use(prefixApi + "/auth", authRoute);

  // Server & Database
  app.listen(process.env.NODE_PORT, async () => {
    const uploadPath = "./uploads/";

    const isPathExists = fs.existsSync(path.resolve(uploadPath));
    if (!isPathExists) {
      console.log("Create uploads folder");
      fs.mkdirSync(uploadPath);
    }

    await models
      .$connect()
      .then(() => console.log("DB Connected"))
      .catch((e) => {
        logger.error(e);
        throw new Error(e.message);
      });

    console.log(
      `Server is running on http://${process.env.NODE_HOST}:${process.env.NODE_PORT}/`,
    );
  });
};

main();
