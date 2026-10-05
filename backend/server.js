const express = require("express");
const cors = require("cors");
const db = require("./db");
const studentRoutes = require("./routes/studentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const jwt = require("jsonwebtoken");

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

//routes
app.use("/api/students", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/faculty", facultyRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "College Internship Management System Backend is running"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});