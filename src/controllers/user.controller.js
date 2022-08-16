const bcrypt = require("bcryptjs");
const { models } = require("../db/index");
const {validationResult} = require("express-validator")
const {prepareResponse} = require("../CONST/response") 

const createUserController = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()});
    }

    const newPassword = await bcrypt.hash(password, 10);

    const user = await models.user.create({
      data: {
        name: name,
        email: email,
        password: newPassword,
      },
    });

    return prepareResponse(res, 201, "Create user succces")
  } catch (error) {
    return prepareResponse(res, 400, error)
  }
};

const getAUser = async (req, res) => {
  const { id } = req.params
  
  try {
    const user = await models.user.findFirst({
      where: {
        id: id
      }
    })

    if (!user) {
      return prepareResponse(res, 404, "User not found")
    }

    return prepareResponse(res, 200, "Get user success", {data: user})
  } catch (error) {
    console.log(error)
    return prepareResponse(res, 400, error)
  }
}

const getListUsers = async (req, res) => {
  let {page, limit} = req.query

  if (!page || page < 0) {
    page = 1
  }
  if (!limit || limit < 0) {
    limit = 2
  }

  try {
    const users = await models.user.findMany({
      take: +limit,
      skip: (page - 1) * limit
    })

    if (!users) {
      return prepareResponse(res, 400, "User not found")
    }
    return prepareResponse(res, 200, "Get list user success", {
      data: users, 
      page: page, 
      limit: limit
    })
  } catch (error) {
    console.log(error)
    return prepareResponse(res, 400, error)
  }
}

const updateUserController = async (req, res) => {
  const {id} = req.params
  const {name, email} = req.body

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return  prepareResponse(res, 404, errors.array())
    }

    const user = await models.user.findFirst({
      where: {
        id: id
      }
    })

    if (!user) {
      return prepareResponse(res, 404, "User Not Found")
    }

    const userInfo = await models.user.update({
      where: {
        id: id
      },
      data: {
        name: name,
        email: email
      }
    })

    return prepareResponse(res, 200, "Update user success")
  } catch (error) {
    console.log(error)
    return prepareResponse(res, 400, error)
  }
}

const deleteUserController = async (req, res) => {
  const {id} = req.params
  try {
    const userInfo = await models.user.delete({
      where: {
        id: id
      }
    })
    return prepareResponse(res, 200, "Delete user success")
  } catch (error) {
    console.log(error)
    return prepareResponse(res, 400, error)
  }
} 


module.exports = {
  createUserController,
  getAUser,
  getListUsers,
  updateUserController,
  deleteUserController
};
