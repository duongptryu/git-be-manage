const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { prepareResponse } = require("../CONST/response");
const { confirmEmail } = require("../CONST/emailTemplate");
const { models } = require("../db/index");
const { sendConfirmEmail } = require("../helpers/mailHandle");
const e = require("express");

const signInController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return prepareResponse(res, 400, error.array());
    }

    const user = await models.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!user) {
      return prepareResponse(res, 400, "Email or Password incorrect");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return prepareResponse(res, 400, "Email or Password incorrect");
    }

    if (!user.active) {
      return prepareResponse(res, 400, "Please verify your account");
    }

    const accessToken = jwt.sign(
      { user_id: user.id },
      process.env.CONFIRM_EMAIL_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXP,
      },
    );

    return prepareResponse(res, 200, { access_token: accessToken });
  } catch (error) {
    console.log(error);
    return prepareResponse(res, 500, error);
  }
};

const signUpController = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newPassword = await bcrypt.hash(password, 10);

    const user = await models.user.findFirst({
      where: {
        email: email,
      },
    });
    if (user) {
      return prepareResponse(res, 400, "Email already exists");
    }

    const userCreate = await models.user.create({
      data: {
        name: name,
        email: email,
        password: newPassword,
        active: true,
      },
    });

    // create JWT with user id
    // const accessToken = jwt.sign(
    //   { email },
    //   process.env.CONFIRM_EMAIL_TOKEN_SECRET,
    //   {
    //     expiresIn: process.env.REFRESH_TOKEN_EXP,
    //   },
    // );

    // await sendConfirmEmail({
    //   from: process.env.EMAIL_USERNAME,
    //   to: email,
    //   subject: "GIT Club - Please verify your account",
    //   html: confirmEmail(
    //     `${process.env.CLIENT_URL}${process.env.CONFIRM_EMAIL_PATH}/?token=${accessToken}`,
    //     name,
    //   ),
    // });

    return prepareResponse(res, 201, "Create user succces");
  } catch (error) {
    console.log(error);
    return prepareResponse(res, 500, error);
  }
};

module.exports = { signInController, signUpController };
