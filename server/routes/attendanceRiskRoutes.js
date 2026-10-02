const express = require("express");

const {
  getAttendanceRisk,
} = require("../controllers/attendanceRiskController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Attendance Risk
 *   description: Attendance risk analysis
 */

/**
 * @swagger
 * /api/v1/attendance-risk/{firebaseUid}:
 *   get:
 *     summary: Get attendance risk for a student
 *     tags: [Attendance Risk]
 *     parameters:
 *       - in: path
 *         name: firebaseUid
 *         required: true
 *         schema:
 *           type: string
 *         example: user123
 *     responses:
 *       200:
 *         description: Attendance risk calculated successfully
 *       404:
 *         description: Student attendance data not found
 */

// GET ATTENDANCE RISK
router.get(
  "/:firebaseUid",
  getAttendanceRisk
);

module.exports = router;