const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const restrict = require("./middleware/restricted.js");

const authRouter = require("./auth/auth-router.js");
const jokesRouter = require("./jokes/jokes-router.js");

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use("/api/auth", authRouter);
server.use("/api/jokes", restrict, jokesRouter); // only logged-in users should have access!

//sanity check!
server.get("/", (req, res, next) => {
  res.status(200).json("API is running for your sanity");
});

module.exports = server;
