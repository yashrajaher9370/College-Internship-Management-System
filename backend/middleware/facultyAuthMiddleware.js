const jwt = require("jsonwebtoken");

const facultyAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Faculty authorization token is required"
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format"
      });
    }

    const decoded = jwt.verify(
      token,
      "college-internship-secret-key"
    );

    if (decoded.role !== "faculty") {
      return res.status(403).json({
        success: false,
        message: "Faculty access required"
      });
    }

    req.faculty = decoded;

    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired faculty token"
    });
  }
};

module.exports = facultyAuthMiddleware;