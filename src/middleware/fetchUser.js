import jwt from "jsonwebtoken";
import { failed_response } from "../utils/response.js";

const fetchUser = (req, res, next) => {
  // Fetching the authentication token from headers
  const token = req.header("Authorization").split(" ")[1];

  if (token == null || token === "") {
    return res.json(
      failed_response(401, "Please authenticate using valid token")
    );
  }

  try {
    // User verification
    const data = jwt.verify(token, process.env.JWT_SECRET);

    if (data?.id === undefined || data?.isAdmin === undefined) {
      return res.status(403).json(failed_response(403, "Unauthorized access"));
    }

    req.user_id = data.id;
    req.isAdmin = data.isAdmin;

    next();
  } catch (error) {
    return res.status(401).json(failed_response(401, error.message));
  }
};

export default fetchUser;
