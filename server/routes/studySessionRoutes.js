const express = require("express");

const {
  createStudySession,
  startStudySession,
  completeStudySession,
  getStudySessions,
} = require("../controllers/studySessionController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Study Sessions
 *   description: Student study session management
 */

/**
 * @swagger
 * /api/v1/study-sessions:
 *   post:
 *     summary: Create a study session
 *     tags: [Study Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firebaseUid
 *               - type
 *               - title
 *             properties:
 *               firebaseUid:
 *                 type: string
 *                 example: user123
 *               type:
 *                 type: string
 *                 enum: [academic, exam, career]
 *                 example: academic
 *               title:
 *                 type: string
 *                 example: DBMS Revision
 *               durationMinutes:
 *                 type: number
 *                 example: 45
 *               status:
 *                 type: string
 *                 enum: [Planned, In Progress, Completed]
 *                 example: Planned
 *     responses:
 *       201:
 *         description: Study session created successfully
 *       400:
 *         description: Invalid study session data
 */

/**
 * @swagger
 * /api/v1/study-sessions/{firebaseUid}:
 *   get:
 *     summary: Get all study sessions for a student
 *     tags: [Study Sessions]
 *     parameters:
 *       - in: path
 *         name: firebaseUid
 *         required: true
 *         schema:
 *           type: string
 *         example: user123
 *     responses:
 *       200:
 *         description: Study sessions retrieved successfully
 *       404:
 *         description: Study sessions not found
 */

/**
 * @swagger
 * /api/v1/study-sessions/{id}/start:
 *   put:
 *     summary: Start a study session
 *     tags: [Study Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 66f123456789abcdef123456
 *     responses:
 *       200:
 *         description: Study session started successfully
 *       404:
 *         description: Study session not found
 */

/**
 * @swagger
 * /api/v1/study-sessions/{id}/complete:
 *   put:
 *     summary: Complete a study session
 *     tags: [Study Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 66f123456789abcdef123456
 *     responses:
 *       200:
 *         description: Study session completed successfully
 *       404:
 *         description: Study session not found
 */

// Create a study session
router.post("/", createStudySession);

// Get all study sessions for a student
router.get("/:firebaseUid", getStudySessions);

// Start a study session
router.put("/:id/start", startStudySession);

// Complete a study session
router.put("/:id/complete", completeStudySession);

module.exports = router;