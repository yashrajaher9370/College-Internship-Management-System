const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");
const router = express.Router();


// =========================
// ADMIN LOGIN
// =========================

router.post("/login", (req, res) => {

  const { email, password } = req.body;

  // Check required fields
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required"
    });
  }


  // Find admin
  const sql = `
    SELECT *
    FROM admins
    WHERE email = ?
  `;

  db.query(sql, [email], async (err, results) => {

    if (err) {
      console.log("Admin login database error:", err);

      return res.status(500).json({
        success: false,
        message: "Database error"
      });
    }


    // Admin not found
    if (results.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }


    const admin = results[0];


    // Compare password
    const passwordMatch = await bcrypt.compare(
      password,
      admin.password
    );


    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }


    // Create JWT token
    const token = jwt.sign(
      {
        admin_id: admin.admin_id,
        email: admin.email,
        role: "admin"
      },
      "college-internship-secret-key",
      {
        expiresIn: "1d"
      }
    );


    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      token: token,
      admin: {
        admin_id: admin.admin_id,
        name: admin.name,
        email: admin.email
      }
    });

  });

});

router.use(adminAuthMiddleware);
// =========================
// ADMIN DASHBOARD STATISTICS
// =========================

router.get("/dashboard-stats", (req, res) => {

  const queries = {
    students: "SELECT COUNT(*) AS total FROM students",

    companies: "SELECT COUNT(*) AS total FROM companies",

    internships: "SELECT COUNT(*) AS total FROM internships",

    applications: "SELECT COUNT(*) AS total FROM applications"
  };


  db.query(queries.students, (err, studentResult) => {

    if (err) {
      console.log("Students count error:", err);

      return res.status(500).json({
        success: false,
        message: "Failed to get students count"
      });
    }


    db.query(queries.companies, (err, companyResult) => {

      if (err) {
        console.log("Companies count error:", err);

        return res.status(500).json({
          success: false,
          message: "Failed to get companies count"
        });
      }


      db.query(queries.internships, (err, internshipResult) => {

        if (err) {
          console.log("Internships count error:", err);

          return res.status(500).json({
            success: false,
            message: "Failed to get internships count"
          });
        }


        db.query(queries.applications, (err, applicationResult) => {

          if (err) {
            console.log("Applications count error:", err);

            return res.status(500).json({
              success: false,
              message: "Failed to get applications count"
            });
          }


          return res.status(200).json({
            success: true,

            statistics: {
              students: studentResult[0].total,
              companies: companyResult[0].total,
              internships: internshipResult[0].total,
              applications: applicationResult[0].total
            }
          });

        });

      });

    });

  });

});

// =========================
// GET ALL STUDENTS
// =========================

router.get("/students", (req, res) => {

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
    ORDER BY student_id DESC
  `;

  db.query(sql, (err, results) => {

    if (err) {
      console.log("Get students error:", err);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch students"
      });
    }

    return res.status(200).json({
      success: true,
      students: results
    });

  });

});

router.get("/companies", (req, res) => {

  const sql = `
    SELECT
      company_id,
      company_name,
      email,
      phone,
      location,
      description,
      created_at
    FROM companies
    ORDER BY company_id DESC
  `;

  db.query(sql, (err, results) => {

    if (err) {
      console.log("Get companies error:", err);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch companies"
      });
    }

    return res.status(200).json({
      success: true,
      companies: results
    });

  });

});
// =========================
// ADD COMPANY
// =========================

router.post("/companies", (req, res) => {

  const {
    company_name,
    email,
    phone,
    location,
    description
  } = req.body;

  // Check required fields
  if (!company_name || !email || !phone || !location) {
    return res.status(400).json({
      success: false,
      message: "Company name, email, phone and location are required"
    });
  }

  // Check if company email already exists
  const checkSql = `
    SELECT company_id
    FROM companies
    WHERE email = ?
  `;

  db.query(checkSql, [email], (err, results) => {

    if (err) {
      console.log("Check company email error:", err);

      return res.status(500).json({
        success: false,
        message: "Database error"
      });
    }

    if (results.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Company with this email already exists"
      });
    }

    // Insert company
    const insertSql = `
      INSERT INTO companies
      (
        company_name,
        email,
        phone,
        location,
        description
      )
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      insertSql,
      [
        company_name,
        email,
        phone,
        location,
        description || null
      ],
      (err, result) => {

        if (err) {
          console.log("Add company error:", err);

          return res.status(500).json({
            success: false,
            message: "Failed to add company"
          });
        }

        return res.status(201).json({
          success: true,
          message: "Company added successfully",
          company_id: result.insertId
        });

      }
    );

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
      i.created_at,
      c.company_name
    FROM internships i
    LEFT JOIN companies c
      ON i.company_id = c.company_id
    ORDER BY i.internship_id DESC
  `;

  db.query(sql, (err, results) => {

    if (err) {
      console.log("Get internships error:", err);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch internships"
      });
    }

    return res.status(200).json({
      success: true,
      internships: results
    });

  });

});
// =========================
// ADD INTERNSHIP
// =========================

router.post("/internships", (req, res) => {

  const {
    company_id,
    title,
    description,
    domain,
    location,
    duration_weeks,
    stipend,
    start_date,
    end_date
  } = req.body;

  // Required fields
  if (
    !company_id ||
    !title ||
    !description ||
    !domain ||
    !location ||
    !duration_weeks ||
    !start_date ||
    !end_date
  ) {
    return res.status(400).json({
      success: false,
      message: "All required internship fields must be filled"
    });
  }

  // Check date order
  if (new Date(start_date) >= new Date(end_date)) {
    return res.status(400).json({
      success: false,
      message: "Start date must be before end date"
    });
  }

  // Check company exists
  const companySql = `
    SELECT company_id
    FROM companies
    WHERE company_id = ?
  `;

  db.query(companySql, [company_id], (err, companyResult) => {

    if (err) {
      console.log("Check company error:", err);

      return res.status(500).json({
        success: false,
        message: "Database error"
      });
    }

    if (companyResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Company not found"
      });
    }

    // Insert internship
    const insertSql = `
      INSERT INTO internships
      (
        company_id,
        title,
        description,
        domain,
        location,
        duration_weeks,
        stipend,
        start_date,
        end_date,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
    `;

    db.query(
      insertSql,
      [
        company_id,
        title,
        description,
        domain,
        location,
        duration_weeks,
        stipend || 0,
        start_date,
        end_date
      ],
      (err, result) => {

        if (err) {
          console.log("Add internship error:", err);

          return res.status(500).json({
            success: false,
            message: "Failed to add internship"
          });
        }

        return res.status(201).json({
          success: true,
          message: "Internship added successfully",
          internship_id: result.insertId
        });

      }
    );

  });

});

router.put("/internships/:id/status", (req, res) => {

  const internshipId = req.params.id;
  const { status } = req.body;

  const allowedStatuses = [
    "Pending",
    "Approved",
    "Rejected"
  ];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid internship status"
    });
  }

  const sql = `
    UPDATE internships
    SET status = ?
    WHERE internship_id = ?
  `;

  db.query(
    sql,
    [status, internshipId],
    (err, result) => {

      if (err) {
        console.log(
          "Update internship status error:",
          err
        );

        return res.status(500).json({
          success: false,
          message: "Failed to update internship status"
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Internship not found"
        });
      }

      return res.status(200).json({
        success: true,
        message: `Internship ${status.toLowerCase()} successfully`
      });

    }
  );

});

router.get("/applications", (req, res) => {

  const sql = `
    SELECT
      a.application_id,
      a.student_id,
      a.internship_id,
      a.resume,
      a.cover_letter,
      a.qualifications,
      a.status,
      a.applied_at,

      s.name AS student_name,
      s.email AS student_email,

      i.title AS internship_title,

      c.company_name

    FROM applications a

    LEFT JOIN students s
      ON a.student_id = s.student_id

    LEFT JOIN internships i
      ON a.internship_id = i.internship_id

    LEFT JOIN companies c
      ON i.company_id = c.company_id

    ORDER BY a.application_id DESC
  `;

  db.query(sql, (err, results) => {

    if (err) {
      console.log("Get applications error:", err);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch applications"
      });
    }

    return res.status(200).json({
      success: true,
      applications: results
    });

  });

});
router.put("/applications/:id/status", (req, res) => {

  const applicationId = req.params.id;
  const { status } = req.body;

  const allowedStatuses = [
    "Pending",
    "Shortlisted",
    "Rejected",
    "Accepted",
    "Withdrawn"
  ];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid application status"
    });
  }

  const sql = `
    UPDATE applications
    SET status = ?
    WHERE application_id = ?
  `;

  db.query(
    sql,
    [status, applicationId],
    (err, result) => {

      if (err) {
        console.log(
          "Update application status error:",
          err
        );

        return res.status(500).json({
          success: false,
          message: "Failed to update application status"
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Application not found"
        });
      }

      return res.status(200).json({
        success: true,
        message: `Application ${status.toLowerCase()} successfully`
      });

    }
  );

});
router.get("/interviews", (req, res) => {

  const sql = `
    SELECT
      iv.interview_id,
      iv.application_id,
      iv.interview_date,
      iv.mode,
      iv.location,
      iv.result,
      iv.notes,
      iv.created_at,

      a.status AS application_status,

      s.name AS student_name,
      s.email AS student_email,

      i.title AS internship_title,

      c.company_name

    FROM interviews iv

    LEFT JOIN applications a
      ON iv.application_id = a.application_id

    LEFT JOIN students s
      ON a.student_id = s.student_id

    LEFT JOIN internships i
      ON a.internship_id = i.internship_id

    LEFT JOIN companies c
      ON i.company_id = c.company_id

    ORDER BY iv.interview_date ASC
  `;

  db.query(sql, (err, results) => {

    if (err) {
      console.log("Get interviews error:", err);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch interviews"
      });
    }

    return res.status(200).json({
      success: true,
      interviews: results
    });

  });

});
router.post("/interviews", (req, res) => {

  const {
    application_id,
    interview_date,
    mode,
    location,
    notes
  } = req.body;

  if (!application_id || !interview_date || !mode) {
    return res.status(400).json({
      success: false,
      message: "Application ID, interview date and mode are required"
    });
  }

  const allowedModes = [
    "Online",
    "Offline"
  ];

  if (!allowedModes.includes(mode)) {
    return res.status(400).json({
      success: false,
      message: "Invalid interview mode"
    });
  }

  const sql = `
    INSERT INTO interviews
    (
      application_id,
      interview_date,
      mode,
      location,
      result,
      notes
    )
    VALUES (?, ?, ?, ?, 'Pending', ?)
  `;

  db.query(
    sql,
    [
      application_id,
      interview_date,
      mode,
      location || null,
      notes || null
    ],
    (err, result) => {

      if (err) {
        console.log("Schedule interview error:", err);

        return res.status(500).json({
          success: false,
          message: "Failed to schedule interview"
        });
      }

      return res.status(201).json({
        success: true,
        message: "Interview scheduled successfully",
        interview_id: result.insertId
      });

    }
  );

});
router.put("/interviews/:id/result", (req, res) => {

  const interviewId = req.params.id;
  const { result } = req.body;

  const allowedResults = [
    "Pending",
    "Selected",
    "Rejected"
  ];

  if (!allowedResults.includes(result)) {
    return res.status(400).json({
      success: false,
      message: "Invalid interview result"
    });
  }

  const sql = `
    UPDATE interviews
    SET result = ?
    WHERE interview_id = ?
  `;

  db.query(
    sql,
    [result, interviewId],
    (err, dbResult) => {

      if (err) {
        console.log(
          "Update interview result error:",
          err
        );

        return res.status(500).json({
          success: false,
          message: "Failed to update interview result"
        });
      }

      if (dbResult.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Interview not found"
        });
      }

      return res.status(200).json({
        success: true,
        message: `Interview result updated to ${result}`
      });

    }
  );

});
router.get("/evaluations", (req, res) => {

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

      s.name AS student_name,
      s.email AS student_email,

      i.title AS internship_title,

      c.company_name

    FROM evaluations e

    LEFT JOIN applications a
      ON e.application_id = a.application_id

    LEFT JOIN students s
      ON a.student_id = s.student_id

    LEFT JOIN internships i
      ON a.internship_id = i.internship_id

    LEFT JOIN companies c
      ON i.company_id = c.company_id

    ORDER BY e.evaluation_id DESC
  `;

  db.query(sql, (err, results) => {

    if (err) {
      console.log("Get evaluations error:", err);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch evaluations"
      });
    }

    return res.status(200).json({
      success: true,
      evaluations: results
    });

  });

});

  // =========================
// ADD EVALUATION
// =========================

router.post("/evaluations", (req, res) => {

  const {
    application_id,
    technical_skills,
    communication_skills,
    teamwork,
    problem_solving,
    overall_rating,
    feedback
  } = req.body;

  // Required fields
  if (
    !application_id ||
    technical_skills === undefined ||
    communication_skills === undefined ||
    teamwork === undefined ||
    problem_solving === undefined ||
    overall_rating === undefined
  ) {
    return res.status(400).json({
      success: false,
      message: "All evaluation fields are required"
    });
  }

  // Validate ratings
  const ratings = [
    technical_skills,
    communication_skills,
    teamwork,
    problem_solving,
    overall_rating
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

  // Check application exists
  const checkApplicationSql = `
    SELECT application_id
    FROM applications
    WHERE application_id = ?
  `;

  db.query(
    checkApplicationSql,
    [application_id],
    (err, applicationResult) => {

      if (err) {
        console.log(
          "Check application error:",
          err
        );

        return res.status(500).json({
          success: false,
          message: "Database error"
        });
      }

      if (applicationResult.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Application not found"
        });
      }

      // Check duplicate evaluation
      const checkEvaluationSql = `
        SELECT evaluation_id
        FROM evaluations
        WHERE application_id = ?
      `;

      db.query(
        checkEvaluationSql,
        [application_id],
        (err, evaluationResult) => {

          if (err) {
            console.log(
              "Check evaluation error:",
              err
            );

            return res.status(500).json({
              success: false,
              message: "Database error"
            });
          }

          if (evaluationResult.length > 0) {
            return res.status(409).json({
              success: false,
              message: "Evaluation already exists for this application"
            });
          }

          // Insert evaluation
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
              application_id,
              technical_skills,
              communication_skills,
              teamwork,
              problem_solving,
              overall_rating,
              feedback || null
            ],
            (err, result) => {

              if (err) {
                console.log(
                  "Add evaluation error:",
                  err
                );

                return res.status(500).json({
                  success: false,
                  message: "Failed to add evaluation"
                });
              }

              return res.status(201).json({
                success: true,
                message: "Evaluation added successfully",
                evaluation_id: result.insertId
              });

            }
          );

        }
      );

    }
  );

});
router.get("/reports", (req, res) => {

  const reportQueries = {

    totalStudents: `
      SELECT COUNT(*) AS total
      FROM students
    `,

    totalCompanies: `
      SELECT COUNT(*) AS total
      FROM companies
    `,

    totalInternships: `
      SELECT COUNT(*) AS total
      FROM internships
    `,

    totalApplications: `
      SELECT COUNT(*) AS total
      FROM applications
    `,

    pendingApplications: `
      SELECT COUNT(*) AS total
      FROM applications
      WHERE status = 'Pending'
    `,

    shortlistedApplications: `
      SELECT COUNT(*) AS total
      FROM applications
      WHERE status = 'Shortlisted'
    `,

    acceptedApplications: `
      SELECT COUNT(*) AS total
      FROM applications
      WHERE status = 'Accepted'
    `,

    rejectedApplications: `
      SELECT COUNT(*) AS total
      FROM applications
      WHERE status = 'Rejected'
    `,

    totalInterviews: `
      SELECT COUNT(*) AS total
      FROM interviews
    `,

    selectedInterviews: `
      SELECT COUNT(*) AS total
      FROM interviews
      WHERE result = 'Selected'
    `,

    rejectedInterviews: `
      SELECT COUNT(*) AS total
      FROM interviews
      WHERE result = 'Rejected'
    `,

    totalEvaluations: `
      SELECT COUNT(*) AS total
      FROM evaluations
    `,

    averageRating: `
      SELECT COALESCE(AVG(overall_rating), 0) AS average
      FROM evaluations
    `
  };

  const report = {};

  const keys = Object.keys(reportQueries);

  let completed = 0;


  keys.forEach((key) => {

    db.query(
      reportQueries[key],
      (err, results) => {

        if (err) {

          console.log(
            "Reports query error:",
            err
          );

          return res.status(500).json({
            success: false,
            message: "Failed to generate reports"
          });

        }


        report[key] = results[0];


        completed++;


        if (completed === keys.length) {

          return res.status(200).json({
            success: true,
            report
          });

        }

      }
    );

  });

});
module.exports = router;