const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const facultyAuthMiddleware = require("../middleware/facultyAuthMiddleware");

const router = express.Router();

// Faculty Login 
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required"
    });
  }

  const sql = `
    SELECT faculty_id, name, email, password, department, phone
    FROM faculty
    WHERE email = ?
  `;

  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.log("Faculty login error:", err);
      return res.status(500).json({
        success: false,
        message: "Database error"
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const faculty = results[0];

    const passwordMatch = await bcrypt.compare(
      password,
      faculty.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        faculty_id: faculty.faculty_id,
        email: faculty.email,
        role: "faculty"
      },
      "college-internship-secret-key",
      {
        expiresIn: "1d"
      }
    );

    return res.json({
      success: true,
      message: "Faculty login successful",
      token,
      faculty: {
        faculty_id: faculty.faculty_id,
        name: faculty.name,
        email: faculty.email,
        department: faculty.department,
        phone: faculty.phone
      }
    });
  });
});

// Faculty Dashboard Statistics
router.get("/dashboard-stats", facultyAuthMiddleware, (req, res) => {

  const queries = {
    students: `
      SELECT COUNT(*) AS total
      FROM students
    `,

    internships: `
      SELECT COUNT(*) AS total
      FROM internships
    `,

    applications: `
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

    interviews: `
      SELECT COUNT(*) AS total
      FROM interviews
    `,

    evaluations: `
      SELECT COUNT(*) AS total
      FROM evaluations
    `
  };

  db.query(queries.students, (err, studentResult) => {

    if (err) {
      console.log("Student count error:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch dashboard statistics"
      });
    }

    db.query(queries.internships, (err, internshipResult) => {

      if (err) {
        console.log("Internship count error:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to fetch dashboard statistics"
        });
      }

      db.query(queries.applications, (err, applicationResult) => {

        if (err) {
          console.log("Application count error:", err);
          return res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics"
          });
        }

        db.query(
          queries.pendingApplications,
          (err, pendingResult) => {

            if (err) {
              console.log("Pending application count error:", err);
              return res.status(500).json({
                success: false,
                message: "Failed to fetch dashboard statistics"
              });
            }

            db.query(
              queries.shortlistedApplications,
              (err, shortlistedResult) => {

                if (err) {
                  console.log(
                    "Shortlisted application count error:",
                    err
                  );

                  return res.status(500).json({
                    success: false,
                    message: "Failed to fetch dashboard statistics"
                  });
                }

                db.query(
                  queries.interviews,
                  (err, interviewResult) => {

                    if (err) {
                      console.log("Interview count error:", err);
                      return res.status(500).json({
                        success: false,
                        message: "Failed to fetch dashboard statistics"
                      });
                    }

                    db.query(
                      queries.evaluations,
                      (err, evaluationResult) => {

                        if (err) {
                          console.log(
                            "Evaluation count error:",
                            err
                          );

                          return res.status(500).json({
                            success: false,
                            message:
                              "Failed to fetch dashboard statistics"
                          });
                        }

                        return res.json({
                          success: true,

                          stats: {
                            totalStudents:
                              studentResult[0].total,

                            totalInternships:
                              internshipResult[0].total,

                            totalApplications:
                              applicationResult[0].total,

                            pendingApplications:
                              pendingResult[0].total,

                            shortlistedApplications:
                              shortlistedResult[0].total,

                            totalInterviews:
                              interviewResult[0].total,

                            totalEvaluations:
                              evaluationResult[0].total
                          }
                        });
                      }
                    );
                  }
                );
              }
            );
          }
        );
      });
    });
  });
});
// Get All Internships for Faculty
router.get("/internships", facultyAuthMiddleware, (req, res) => {

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
    ORDER BY i.created_at DESC
  `;

  db.query(sql, (err, results) => {

    if (err) {
      console.log("Faculty internships error:", err);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch internships"
      });
    }

    return res.json({
      success: true,
      internships: results
    });
  });
});
// Faculty Add Internship
router.post("/internships", facultyAuthMiddleware, (req, res) => {

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

  // Required fields validation
  if (
    !company_id ||
    !title ||
    !description ||
    !domain ||
    !location ||
    !duration_weeks ||
    stipend === undefined ||
    !start_date ||
    !end_date
  ) {
    return res.status(400).json({
      success: false,
      message: "All internship fields are required"
    });
  }

  // Date validation
  if (new Date(start_date) >= new Date(end_date)) {
    return res.status(400).json({
      success: false,
      message: "Start date must be before end date"
    });
  }

  // Check company
  const checkCompanySql = `
    SELECT company_id
    FROM companies
    WHERE company_id = ?
  `;

  db.query(
    checkCompanySql,
    [company_id],
    (err, companyResult) => {

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
          stipend,
          start_date,
          end_date
        ],
        (err, result) => {

          if (err) {
            console.log("Faculty add internship error:", err);

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
    }
  );
});
// Faculty View Applications
router.get("/applications", facultyAuthMiddleware, (req, res) => {

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
      s.phone AS student_phone,
      s.department,
      s.gpa,

      i.title AS internship_title,
      i.domain,
      i.location,

      c.company_name

    FROM applications a

    INNER JOIN students s
      ON a.student_id = s.student_id

    INNER JOIN internships i
      ON a.internship_id = i.internship_id

    INNER JOIN companies c
      ON i.company_id = c.company_id

    ORDER BY a.applied_at DESC
  `;

  db.query(sql, (err, results) => {

    if (err) {
      console.log("Faculty applications error:", err);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch applications"
      });
    }

    return res.json({
      success: true,
      applications: results
    });
  });
});
// Faculty Update Application Status
router.put(
  "/applications/:id/status",
  facultyAuthMiddleware,
  (req, res) => {

    const applicationId = req.params.id;
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Shortlisted",
      "Rejected",
      "Accepted",
      "Withdrawn"
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status"
      });
    }

    // Check application exists
    const checkSql = `
      SELECT application_id, status
      FROM applications
      WHERE application_id = ?
    `;

    db.query(
      checkSql,
      [applicationId],
      (err, results) => {

        if (err) {
          console.log("Check application error:", err);

          return res.status(500).json({
            success: false,
            message: "Database error"
          });
        }

        if (results.length === 0) {
          return res.status(404).json({
            success: false,
            message: "Application not found"
          });
        }

        const currentStatus = results[0].status;

        // Prevent invalid status changes
        if (
          currentStatus === "Rejected" ||
          currentStatus === "Accepted"
        ) {
          return res.status(400).json({
            success: false,
            message: "Final application status cannot be changed"
          });
        }

        const updateSql = `
          UPDATE applications
          SET status = ?
          WHERE application_id = ?
        `;

        db.query(
          updateSql,
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

            return res.json({
              success: true,
              message: "Application status updated successfully",
              status
            });
          }
        );
      }
    );
  }
);
// Faculty View Interviews
router.get("/interviews", facultyAuthMiddleware, (req, res) => {

  const sql = `
    SELECT
      i.interview_id,
      i.application_id,
      i.interview_date,
      i.mode,
      i.location,
      i.result,
      i.notes,
      i.created_at,

      s.name AS student_name,
      s.email AS student_email,

      ins.title AS internship_title,

      c.company_name

    FROM interviews i

    INNER JOIN applications a
      ON i.application_id = a.application_id

    INNER JOIN students s
      ON a.student_id = s.student_id

    INNER JOIN internships ins
      ON a.internship_id = ins.internship_id

    INNER JOIN companies c
      ON ins.company_id = c.company_id

    ORDER BY i.interview_date ASC
  `;

  db.query(sql, (err, results) => {

    if (err) {
      console.log("Faculty interviews error:", err);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch interviews"
      });
    }

    return res.json({
      success: true,
      interviews: results
    });
  });
});
// Faculty Schedule Interview
router.post(
  "/interviews",
  facultyAuthMiddleware,
  (req, res) => {

    const {
      application_id,
      interview_date,
      mode,
      location,
      notes
    } = req.body;

    // Required fields
    if (
      !application_id ||
      !interview_date ||
      !mode
    ) {
      return res.status(400).json({
        success: false,
        message: "Application, interview date and mode are required"
      });
    }
// Check interview date
const interviewDateTime = new Date(interview_date);
const currentDateTime = new Date();

const minimumInterviewTime =
  new Date(currentDateTime.getTime() + 24 * 60 * 60 * 1000);

if (interviewDateTime <= minimumInterviewTime) {
  return res.status(400).json({
    success: false,
    message: "Interview must be scheduled at least 24 hours in advance"
  });
}
    // Validate mode
    if (!["Online", "Offline"].includes(mode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid interview mode"
      });
    }

    // Check application
    const checkApplicationSql = `
  SELECT 
    a.application_id,
    a.status,
    i.end_date
  FROM applications a
  JOIN internships i
    ON a.internship_id = i.internship_id
  WHERE a.application_id = ?
`;

    db.query(
      checkApplicationSql,
      [application_id],
      (err, applicationResult) => {

        if (err) {
          console.log("Check application error:", err);

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

        const application = applicationResult[0];

const interviewDateTime = new Date(interview_date);
const internshipEndDate = new Date(application.end_date);

if (interviewDateTime > internshipEndDate) {
  return res.status(400).json({
    success: false,
    message: "Interview must be scheduled before the internship deadline"
  });
}
        // Only shortlisted or accepted applications
        if (
          application.status !== "Shortlisted" &&
          application.status !== "Accepted"
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Interview can only be scheduled for shortlisted or accepted applications"
          });
        }

        // Check duplicate interview
        const checkInterviewSql = `
          SELECT interview_id
          FROM interviews
          WHERE application_id = ?
        `;

        db.query(
          checkInterviewSql,
          [application_id],
          (err, interviewResult) => {

            if (err) {
              console.log(
                "Check interview error:",
                err
              );

              return res.status(500).json({
                success: false,
                message: "Database error"
              });
            }

            if (interviewResult.length > 0) {
              return res.status(409).json({
                success: false,
                message:
                  "Interview already scheduled for this application"
              });
            }

            const insertSql = `
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
              insertSql,
              [
                application_id,
                interview_date,
                mode,
                location || null,
                notes || null
              ],
              (err, result) => {

                if (err) {
                  console.log(
                    "Schedule interview error:",
                    err
                  );

                  return res.status(500).json({
                    success: false,
                    message:
                      "Failed to schedule interview"
                  });
                }

                return res.status(201).json({
                  success: true,
                  message:
                    "Interview scheduled successfully",
                  interview_id: result.insertId
                });
              }
            );
          }
        );
      }
    );
  }
);
router.put(
  "/interviews/:id/result",
  facultyAuthMiddleware,
  (req, res) => {

    const { id } = req.params;
    const { result, notes } = req.body;

    if (!result) {
      return res.status(400).json({
        success: false,
        message: "Interview result is required"
      });
    }

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
      SET result = ?, notes = ?
      WHERE interview_id = ?
    `;

    db.query(
      sql,
      [result, notes || null, id],
      (err, resultData) => {

        if (err) {
          console.log("Update interview result error:", err);

          return res.status(500).json({
            success: false,
            message: "Failed to update interview result"
          });
        }

        if (resultData.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message: "Interview not found"
          });
        }

        return res.json({
          success: true,
          message: "Interview result updated successfully"
        });
      }
    );
  }
);
module.exports = router;