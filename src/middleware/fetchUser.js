import jwt from "jsonwebtoken";
import { failed_response } from "../utils/response.js";

// Middleware for user verification for securing routes
const fetchUser = (req, res, next) => {
  // Fetching the authentication token from headers
  const token = req.header("auth-token");

  if (token == null || token === "") {
    return res.json(
      failed_response(401, "Please authenticate using valid token")
    );
  }

  try {
    // User verification
    const data = jwt.verify(token, process.env.JWT_SECRET);

    req.user_id = data.id;

    next();
  } catch (error) {
    res.status(401).json(failed_response(401, error.message));
  }
};

export default fetchUser;
