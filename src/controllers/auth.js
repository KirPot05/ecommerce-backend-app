import { validationResult } from "express-validator";
import { failed_response, success_response } from "../utils/response.js";
import {
  encryptPassword,
  isCorrectPassword,
  getAuthToken,
} from "../utils/passwordUtil.js";
import User from "../models/User.js";
import { ALLOWED_USER_FIELDS } from "../utils/constants.js";

export async function userLogin(req, res) {
  // Validation results error handling
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(failed_response(500, "Something went wrong", errors.array()));
  }

  try {
    const { email, password } = req.body;
    let userData;

    if (email != null && email != "") {
      userData = await User.findOne({ email: email });
    }

    if (userData == null) {
      return res.status(404).json(failed_response(404, "User not found"));
    }

    // Compares hashed password in DB and entered password
    const passwordMatches = await isCorrectPassword(
      password,
      userData.password
    );
    if (!passwordMatches) {
      return res.status(500).json({ error: "Please enter valid credentials" });
    }

    // Returns Logged in user's id
    const data = {
      id: userData.id,
      isAdmin: userData.isAdmin,
    };

    // Signs and generates an authentication token
    const authToken = await getAuthToken(data);

    // Passing created user's data {authenticated token} as response
    res.json(success_response(200, "Login successful", authToken));
  } catch (error) {
    console.error(error.message);
    res.status(500).json(failed_response(500, "Internal Server Error"));
  }
}

export async function createUser(req, res) {
  // Validation results error handling
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(failed_response(500, "Something went wrong", errors.array()));
  }

  try {
    let userData;

    // DB operation to find user
    userData = await User.findOne({
      email: req.body.email,
    });

    if (userData != null) {
      return res.status(400).json(failed_response(400, "User already exists"));
    }

    const { userName, email, password } = req.body;
    const secPassword = await encryptPassword(password);
    userData = {
      userName,
      email,
      password: secPassword,
    };

    // DB operation to create user
    const user = await User.create(userData);
    const data = {
      id: user.id,
      isAdmin: user.isAdmin,
    };

    const authToken = await getAuthToken(data);
    return res.json(
      success_response(200, "Registration successful", authToken)
    );
  } catch (error) {
    console.error(error.message);
    return res.status(500).json(failed_response(500, "Internal server error"));
  }
}

export async function editUser(req, res) {
  const userId = req.params.id;

  try {
    if (req.user_id !== userId && req.isAmin) {
      return res
        .status(403)
        .json(failed_response(403, "Unauthorized Operation"));
    }

    if (Object.keys(req.body).length === 0) {
      return res.json(failed_response(400, "No fields to edit"));
    }

    const fieldsToEdit = Object.keys(req.body);

    for (let field of fieldsToEdit) {
      if (!ALLOWED_USER_FIELDS.includes(field)) {
        return res.json(failed_response(400, ` [${field}] - Invalid field`));
      }
    }

    let userCredetails = {};
    const { password, ...rest } = req.body;
    userCredetails = { ...rest };

    if (fieldsToEdit.includes("password")) {
      const secPassword = await encryptPassword(password);
      userCredetails["password"] = secPassword;
    }

    await User.findByIdAndUpdate(userId, userCredetails, {
      new: true,
    });

    return res
      .status(200)
      .json(success_response(200, "Successfully updated user-info"));
  } catch (error) {
    console.error(error.message);
    return res.json(failed_response(500, "Internal server error"));
  }
}

export async function fetchUserInfo(req, res) {
  const userId = req.params.id;
  try {
    if (req.user_id !== userId || !req.isAdmin) {
      return res
        .status(403)
        .json(failed_response(403, "Unauthorized operation"));
    }

    const user = await User.findById(userId, { password: 0 });
    if (user === null)
      return res.status(404).json(failed_response(404, "User not found"));

    // const { password, ...userDetails } = user._doc;

    return res
      .status(200)
      .json(success_response(200, "Successfully fetched user", user));
  } catch (error) {
    console.error(error.message);
    return res.status(500).json(failed_response(500, "Internal server error"));
  }
}

export async function fetchAllUsers(req, res) {
  try {
    if (!req.isAdmin) {
      return res
        .status(403)
        .json(failed_response(403, "Unauthorized operation"));
    }

    const users = await User.find({}, { password: 0 });
    if (users.length === 0)
      return res.status(404).json(failed_response(404, "No user found"));

    return res
      .status(200)
      .json(success_response(200, "Successfully fetched users", users));
  } catch (error) {
    console.error(error.message);
    return res.status(500).json(failed_response(500, "Internal server error"));
  }
}
