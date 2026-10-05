const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required"
      });
    }

    // Expected format:
    // Bearer TOKEN
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format"
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(
  token,
  "college-internship-secret-key"
);

// Check student role
if (decoded.role !== "student") {
  return res.status(403).json({
    success: false,
    message: "Student access required"
  });
}

req.student = decoded;
next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

module.exports = authMiddleware;