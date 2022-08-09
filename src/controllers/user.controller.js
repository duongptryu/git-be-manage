const bcrypt = require("bcryptjs");
const { models } = require("../db/index");

const helloWorld = async (req, res) => {
  return res.status(200).json({
    hello: "world",
  });
};

const createUserController = async (req, res) => {
  const { email, password, name } = req.body;

  const newPassword = await bcrypt.hash(password, 10);

  const user = await models.user.create({
    data: {
      name: name,
      email: email,
      password: newPassword,
    },
  });
  console.log(user);
  return res.status(201).json(user);
};

module.exports = {
  helloWorld,
  createUserController,
};
