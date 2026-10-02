const express = require("express");

const {
  createExam,
  getExams,
  updateExamStatus,
  deleteExam,
} = require("../controllers/examController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Exams
 *   description: Student exam and assessment management
 */

/**
 * @swagger
 * /api/v1/exams:
 *   post:
 *     summary: Create an exam
 *     tags: [Exams]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firebaseUid
 *               - subject
 *               - examDate
 *             properties:
 *               firebaseUid:
 *                 type: string
 *                 example: user123
 *               subject:
 *                 type: string
 *                 example: DBMS
 *               examDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-09-24
 *               examType:
 *                 type: string
 *                 enum: [Internal, Midterm, Semester, Practical, Other]
 *                 example: Internal
 *               importance:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *                 example: High
 *               status:
 *                 type: string
 *                 enum: [Upcoming, Completed]
 *                 example: Upcoming
 *     responses:
 *       201:
 *         description: Exam created successfully
 *       400:
 *         description: Invalid exam data
 */

/**
 * @swagger
 * /api/v1/exams/{firebaseUid}:
 *   get:
 *     summary: Get all exams for a student
 *     tags: [Exams]
 *     parameters:
 *       - in: path
 *         name: firebaseUid
 *         required: true
 *         schema:
 *           type: string
 *         example: user123
 *     responses:
 *       200:
 *         description: Exams retrieved successfully
 *       404:
 *         description: Exams not found
 */

/**
 * @swagger
 * /api/v1/exams/{id}/status:
 *   put:
 *     summary: Update exam status
 *     tags: [Exams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 66f123456789abcdef123456
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Upcoming, Completed]
 *                 example: Completed
 *     responses:
 *       200:
 *         description: Exam status updated successfully
 *       404:
 *         description: Exam not found
 */

/**
 * @swagger
 * /api/v1/exams/{id}:
 *   delete:
 *     summary: Delete an exam
 *     tags: [Exams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 66f123456789abcdef123456
 *     responses:
 *       200:
 *         description: Exam deleted successfully
 *       404:
 *         description: Exam not found
 */

// Create exam
router.post("/", createExam);

// Get all exams for a student
router.get("/:firebaseUid", getExams);

// Update exam status
router.put("/:id/status", updateExamStatus);

// Delete exam
router.delete("/:id", deleteExam);

module.exports = router;