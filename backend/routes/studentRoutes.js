const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/resumes");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + file.originalname;

    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,

  limits: {
    fileSize: 5 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  }
});

// Student Registration
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      department,
      gpa
    } = req.body;

    // Check required fields
    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !department ||
      gpa === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Check if email already exists
    const checkSql =
      "SELECT student_id FROM students WHERE email = ?";

    db.query(checkSql, [email], async (err, results) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          success: false,
          message: "Database error"
        });
      }

      if (results.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Email already registered"
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert student
      const insertSql = `
        INSERT INTO students
        (name, email, password, phone, department, gpa)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      db.query(
        insertSql,
        [
          name,
          email,
          hashedPassword,
          phone,
          department,
          gpa
        ],
        (err, result) => {
          if (err) {
            console.log(err);

            return res.status(500).json({
              success: false,
              message: "Failed to register student"
            });
          }

          res.status(201).json({
            success: true,
            message: "Student registered successfully",
            studentId: result.insertId
          });
        }
      );
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});
// Student Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Check required fields
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required"
    });
  }

  // Find student by email
  const sql = `
    SELECT *
    FROM students
    WHERE email = ?
  `;

  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
        message: "Database error"
      });
    }

    // Student not found
    if (results.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const student = results[0];

    // Compare password
    const isPasswordValid = await bcrypt.compare(
      password,
      student.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        studentId: student.student_id,
        email: student.email,
        role: "student"
      },
      "college-internship-secret-key",
      {
        expiresIn: "1d"
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
      student: {
        id: student.student_id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        department: student.department,
        gpa: student.gpa
      }
    });
  });
});

router.get("/profile", authMiddleware, (req, res) => {

  const studentId = req.student.studentId;

  const sql = `
    SELECT
      student_id,
      name,
      email,
      phone,
      department,
      gpa,
      resume,
      created_at
    FROM students
    WHERE student_id = ?
  `;

  db.query(sql, [studentId], (err, results) => {

    if (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
        message: "Database error"
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.status(200).json({
      success: true,
      student: results[0]
    });

  });
});

// Student Application Statistics
router.get("/application-stats", authMiddleware, (req, res) => {

  const studentId = req.student.studentId;

  const sql = `
    SELECT
      COUNT(*) AS totalApplications,
      SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) AS pendingApplications,
      SUM(CASE WHEN status = 'Accepted' THEN 1 ELSE 0 END) AS acceptedApplications
    FROM applications
    WHERE student_id = ?
  `;

  db.query(sql, [studentId], (err, results) => {

    if (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
        message: "Database error"
      });
    }

    const stats = results[0];

    res.status(200).json({
      success: true,
      statistics: {
        totalApplications: Number(stats.totalApplications),
        pendingApplications: Number(stats.pendingApplications),
        acceptedApplications: Number(stats.acceptedApplications)
      }
    });

  });
});
// Student Upcoming Interview Count
router.get("/upcoming-interview-count", authMiddleware, (req, res) => {

  const studentId = req.student.studentId;

  const sql = `
    SELECT COUNT(*) AS upcomingInterviews
    FROM interviews i
    INNER JOIN applications a
      ON i.application_id = a.application_id
    WHERE a.student_id = ?
      AND i.interview_date >= NOW()
  `;

  db.query(sql, [studentId], (err, results) => {

    if (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
        message: "Database error"
      });
    }

    res.status(200).json({
      success: true,
      upcomingInterviews: Number(results[0].upcomingInterviews)
    });

  });
});
// Student Recent Applications
router.get("/recent-applications", authMiddleware, (req, res) => {

  const studentId = req.student.studentId;

  const sql = `
    SELECT
      a.application_id,
      a.status,
      a.applied_at,
      i.title AS internship_title,
      c.company_name
    FROM applications a
    INNER JOIN internships i
      ON a.internship_id = i.internship_id
    INNER JOIN companies c
      ON i.company_id = c.company_id
    WHERE a.student_id = ?
    ORDER BY a.applied_at DESC
    LIMIT 3
  `;

  db.query(sql, [studentId], (err, results) => {

    if (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
        message: "Database error"
      });
    }

    res.status(200).json({
      success: true,
      applications: results
    });

  });
});
router.get("/applications", authMiddleware, (req, res) => {

  const studentId = req.student.studentId;

  const sql = `
    SELECT
      a.application_id,
      a.internship_id,
      a.status,
      a.applied_at,
      ins.title AS internship_title,
      ins.location,
      c.company_name
    FROM applications a
    INNER JOIN internships ins
      ON a.internship_id = ins.internship_id
    INNER JOIN companies c
      ON ins.company_id = c.company_id
    WHERE a.student_id = ?
    ORDER BY a.applied_at DESC
  `;

  db.query(sql, [studentId], (err, results) => {

    if (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
        message: "Database error"
      });
    }

    res.status(200).json({
      success: true,
      applications: results
    });

  });
});
router.get("/internships", (req, res) => {

  const sql = `
    SELECT
      i.internship_id,
      i.title,
      i.description,
      i.domain,
      i.location,
      i.duration_weeks,
      i.stipend,
      i.start_date,
      i.end_date,
      i.status,
      c.company_name
    FROM internships i
    INNER JOIN companies c
      ON i.company_id = c.company_id
    WHERE i.status = 'Approved'
    ORDER BY i.created_at DESC
  `;

  db.query(sql, (err, results) => {

    if (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
        message: "Database error"
      });
    }

    res.status(200).json({
      success: true,
      internships: results
    });

  });

});
router.get("/internships/:id", (req, res) => {

  const internshipId = req.params.id;

  const sql = `
    SELECT
      i.internship_id,
      i.title,
      i.description,
      i.domain,
      i.location,
      i.duration_weeks,
      i.stipend,
      i.start_date,
      i.end_date,
      i.status,
      c.company_name
    FROM internships i
    INNER JOIN companies c
      ON i.company_id = c.company_id
    WHERE i.internship_id = ?
      AND i.status = 'Approved'
  `;

  db.query(sql, [internshipId], (err, results) => {

    if (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
        message: "Database error"
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Internship not found"
      });
    }

    res.status(200).json({
      success: true,
      internship: results[0]
    });

  });
});
router.post(
  "/applications",
  authMiddleware,
  upload.single("resume"),
  (req, res) => {

    const studentId = req.student.studentId;

    const {
      internshipId,
      coverLetter,
      qualifications
    } = req.body;

    // Check required fields
    if (!internshipId || !coverLetter || !qualifications) {
      return res.status(400).json({
        success: false,
        message: "All application fields are required"
      });
    }

    // Check resume
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume PDF"
      });
    }

    // Resume path
    const resumePath =
      `/uploads/resumes/${req.file.filename}`;

    // Check whether internship exists and is approved
    const internshipSql = `
      SELECT internship_id
      FROM internships
      WHERE internship_id = ?
        AND status = 'Approved'
    `;

    db.query(
      internshipSql,
      [internshipId],
      (err, internshipResults) => {

        if (err) {
          console.log(err);

          return res.status(500).json({
            success: false,
            message: "Database error"
          });
        }

        if (internshipResults.length === 0) {
          return res.status(404).json({
            success: false,
            message: "Internship not found"
          });
        }

        // Check duplicate application
        const duplicateSql = `
          SELECT application_id
          FROM applications
          WHERE student_id = ?
            AND internship_id = ?
        `;

        db.query(
          duplicateSql,
          [studentId, internshipId],
          (err, duplicateResults) => {

            if (err) {
              console.log(err);

              return res.status(500).json({
                success: false,
                message: "Database error"
              });
            }

            if (duplicateResults.length > 0) {
              return res.status(409).json({
                success: false,
                message: "You have already applied for this internship"
              });
            }

            // Insert application
            const insertSql = `
              INSERT INTO applications
              (
                student_id,
                internship_id,
                resume,
                cover_letter,
                qualifications
              )
              VALUES (?, ?, ?, ?, ?)
            `;

            db.query(
              insertSql,
              [
                studentId,
                internshipId,
                resumePath,
                coverLetter,
                qualifications
              ],
              (err, result) => {

                if (err) {
                  console.log(err);

                  return res.status(500).json({
                    success: false,
                    message: "Failed to submit application"
                  });
                }

                res.status(201).json({
                  success: true,
                  message: "Application submitted successfully",
                  applicationId: result.insertId,
                  resume: resumePath
                });

              }
            );

          }
        );

      }
    );

  }
);
// Student Upcoming Interview Details
router.get("/upcoming-interview", authMiddleware, (req, res) => {

  const studentId = req.student.studentId;

  const sql = `
    SELECT
      i.interview_id,
      i.interview_date,
      i.mode,
      i.location,
      i.result,
      i.notes,
      a.application_id,
      a.status AS application_status,
      ins.title AS internship_title,
      c.company_name
    FROM interviews i
    INNER JOIN applications a
      ON i.application_id = a.application_id
    INNER JOIN internships ins
      ON a.internship_id = ins.internship_id
    INNER JOIN companies c
      ON ins.company_id = c.company_id
    WHERE a.student_id = ?
      AND i.interview_date >= NOW()
    ORDER BY i.interview_date ASC
    LIMIT 1
  `;

  db.query(sql, [studentId], (err, results) => {

    if (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
        message: "Database error"
      });
    }

    res.status(200).json({
      success: true,
      interview: results.length > 0 ? results[0] : null
    });

  });
});

router.post(
  "/upload-resume",
  authMiddleware,
  upload.single("resume"),
  (req, res) => {

    const studentId = req.student.studentId;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume PDF"
      });
    }

    const resumePath = `/uploads/resumes/${req.file.filename}`;

    const sql = `
      UPDATE students
      SET resume = ?
      WHERE student_id = ?
    `;

    db.query(
      sql,
      [resumePath, studentId],
      (err, result) => {

        if (err) {
          console.log(err);

          return res.status(500).json({
            success: false,
            message: "Failed to save resume"
          });
        }

        res.status(200).json({
          success: true,
          message: "Resume uploaded successfully",
          resume: resumePath
        });

      }
    );
  }
);
// UPDATE STUDENT PROFILE
router.put("/profile", authMiddleware, (req, res) => {

  const studentId = req.student.studentId;

  const {
    name,
    phone,
    department,
    gpa
  } = req.body;

  // Basic validation
  if (!name || !phone || !department || gpa === undefined) {
    return res.status(400).json({
      success: false,
      message: "All profile fields are required"
    });
  }

  // GPA validation
  if (Number(gpa) < 0 || Number(gpa) > 4) {
    return res.status(400).json({
      success: false,
      message: "GPA must be between 0 and 4"
    });
  }

  const sql = `
    UPDATE students
    SET
      name = ?,
      phone = ?,
      department = ?,
      gpa = ?
    WHERE student_id = ?
  `;

  db.query(
    sql,
    [
      name,
      phone,
      department,
      gpa,
      studentId
    ],
    (err, result) => {

      if (err) {
        console.log(err);

        return res.status(500).json({
          success: false,
          message: "Failed to update profile"
        });
      }

      res.status(200).json({
        success: true,
        message: "Profile updated successfully"
      });

    }
  );

});
// GET STUDENT INTERVIEWS
router.get("/interviews", authMiddleware, (req, res) => {
  const studentId = req.student.studentId;

  const sql = `
    SELECT
      i.interview_id,
      i.interview_date,
      i.mode,
      i.location,
      i.result,
      i.notes,
      ins.title AS internship_title,
      c.company_name
    FROM interviews i
    INNER JOIN applications a
      ON i.application_id = a.application_id
    INNER JOIN internships ins
      ON a.internship_id = ins.internship_id
    INNER JOIN companies c
      ON ins.company_id = c.company_id
    WHERE a.student_id = ?
    ORDER BY i.interview_date ASC
  `;

  db.query(sql, [studentId], (err, results) => {

    if (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch interviews"
      });
    }

    res.status(200).json({
      success: true,
      interviews: results
    });

  });
});

// SUBMIT STUDENT FEEDBACK
router.post("/feedback", authMiddleware, (req, res) => {
  const studentId = req.student.studentId;

  const {
    applicationId,
    technicalSkills,
    communicationSkills,
    teamwork,
    problemSolving,
    overallRating,
    feedback
  } = req.body;

  // Check required fields
  if (
    !applicationId ||
    technicalSkills === undefined ||
    communicationSkills === undefined ||
    teamwork === undefined ||
    problemSolving === undefined ||
    overallRating === undefined ||
    !feedback
  ) {
    return res.status(400).json({
      success: false,
      message: "All feedback fields are required"
    });
  }

  // Validate ratings
  const ratings = [
    technicalSkills,
    communicationSkills,
    teamwork,
    problemSolving,
    overallRating
  ];

  const invalidRating = ratings.some(
    (rating) =>
      Number(rating) < 1 ||
      Number(rating) > 5
  );

  if (invalidRating) {
    return res.status(400).json({
      success: false,
      message: "All ratings must be between 1 and 5"
    });
  }

  // Check whether application belongs to logged-in student
  const applicationSql = `
    SELECT application_id
    FROM applications
    WHERE application_id = ?
      AND student_id = ?
  `;

  db.query(
    applicationSql,
    [applicationId, studentId],
    (err, applicationResults) => {

      if (err) {
        console.log(err);

        return res.status(500).json({
          success: false,
          message: "Database error"
        });
      }

      if (applicationResults.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Application not found"
        });
      }

      // Check whether feedback already exists
      const existingSql = `
        SELECT evaluation_id
        FROM evaluations
        WHERE application_id = ?
      `;

      db.query(
        existingSql,
        [applicationId],
        (err, existingResults) => {

          if (err) {
            console.log(err);

            return res.status(500).json({
              success: false,
              message: "Database error"
            });
          }

          if (existingResults.length > 0) {
            return res.status(409).json({
              success: false,
              message: "Feedback already submitted for this application"
            });
          }

          // Insert feedback
          const insertSql = `
            INSERT INTO evaluations
            (
              application_id,
              technical_skills,
              communication_skills,
              teamwork,
              problem_solving,
              overall_rating,
              feedback
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `;

          db.query(
            insertSql,
            [
              applicationId,
              technicalSkills,
              communicationSkills,
              teamwork,
              problemSolving,
              overallRating,
              feedback
            ],
            (err, result) => {

              if (err) {
                console.log(err);

                return res.status(500).json({
                  success: false,
                  message: "Failed to submit feedback"
                });
              }

              res.status(201).json({
                success: true,
                message: "Feedback submitted successfully",
                evaluationId: result.insertId
              });

            }
          );

        }
      );

    }
  );

});
// GET STUDENT FEEDBACK
router.get("/feedback", authMiddleware, (req, res) => {
  const studentId = req.student.studentId;

  const sql = `
    SELECT
      e.evaluation_id,
      e.application_id,
      e.technical_skills,
      e.communication_skills,
      e.teamwork,
      e.problem_solving,
      e.overall_rating,
      e.feedback,
      e.evaluated_at,
      ins.title AS internship_title,
      c.company_name
    FROM evaluations e
    INNER JOIN applications a
      ON e.application_id = a.application_id
    INNER JOIN internships ins
      ON a.internship_id = ins.internship_id
    INNER JOIN companies c
      ON ins.company_id = c.company_id
    WHERE a.student_id = ?
    ORDER BY e.evaluated_at DESC
  `;

  db.query(sql, [studentId], (err, results) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch feedback"
      });
    }

    res.status(200).json({
      success: true,
      feedback: results
    });
  });
});
module.exports = router;