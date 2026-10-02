const express = require("express");

const {
  createAssignment,
  getAssignments,
  updateAssignmentStatus,
  deleteAssignment,
  getAcademicRisk,
} = require("../controllers/assignmentController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Assignments
 *   description: Academic assignment management
 */

/**
 * @swagger
 * /api/v1/assignments:
 *   post:
 *     summary: Create a new assignment
 *     tags: [Assignments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firebaseUid
 *               - title
 *               - dueDate
 *             properties:
 *               firebaseUid:
 *                 type: string
 *                 example: user123
 *               subjectId:
 *                 type: string
 *                 example: DBMS
 *               title:
 *                 type: string
 *                 example: Database Management Mini Project
 *               description:
 *                 type: string
 *                 example: Complete the DBMS mini project
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-09-30
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *                 example: High
 *               status:
 *                 type: string
 *                 enum: [Pending, In Progress, Completed]
 *                 example: Pending
 *               estimatedHours:
 *                 type: number
 *                 example: 3
 *     responses:
 *       201:
 *         description: Assignment created successfully
 *       400:
 *         description: Invalid assignment data
 */

/**
 * @swagger
 * /api/v1/assignments/{firebaseUid}/risk:
 *   get:
 *     summary: Get academic risk based on assignments
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: firebaseUid
 *         required: true
 *         schema:
 *           type: string
 *         example: user123
 *     responses:
 *       200:
 *         description: Academic risk calculated successfully
 *       404:
 *         description: Student not found
 */

/**
 * @swagger
 * /api/v1/assignments/{firebaseUid}:
 *   get:
 *     summary: Get all assignments for a student
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: firebaseUid
 *         required: true
 *         schema:
 *           type: string
 *         example: user123
 *     responses:
 *       200:
 *         description: Assignments retrieved successfully
 *       404:
 *         description: Student not found
 */

/**
 * @swagger
 * /api/v1/assignments/{id}/status:
 *   put:
 *     summary: Update assignment status
 *     tags: [Assignments]
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
 *                 enum: [Pending, In Progress, Completed]
 *                 example: Completed
 *     responses:
 *       200:
 *         description: Assignment status updated successfully
 *       404:
 *         description: Assignment not found
 */

/**
 * @swagger
 * /api/v1/assignments/{id}:
 *   delete:
 *     summary: Delete an assignment
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 66f123456789abcdef123456
 *     responses:
 *       200:
 *         description: Assignment deleted successfully
 *       404:
 *         description: Assignment not found
 */

// Create assignment
router.post("/", createAssignment);

// Get academic risk
router.get("/:firebaseUid/risk", getAcademicRisk);

// Get assignments
router.get("/:firebaseUid", getAssignments);

// Update assignment status
router.put("/:id/status", updateAssignmentStatus);

// Delete assignment
router.delete("/:id", deleteAssignment);

module.exports = router;