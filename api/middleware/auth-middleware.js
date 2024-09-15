const { findBy } = require("../jokes/jokes-model");

const checkUsernameExists = (req, res, next) => {
  const { username } = req.body;
  const checkUser = findBy({ username }).first();
  if (checkUser.username === username) {
    res
      .status(401)
      .json({ message: "Invalid credentials: Username already exists" });
  } else {
    next();
  }
};

async function checkUsernameTaken(req, res, next) {
  const checkUsername = await findBy({ username: req.body.username });
  if (checkUsername.length >= 1) {
    res.status(422).json({ message: "Username is invalid" });
  } else {
    next();
  }
}

module.exports = {
  checkUsernameExists,
  checkUsernameTaken,
};
