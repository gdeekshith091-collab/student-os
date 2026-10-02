const express = require("express");

const {
  createAttendance,
  getAttendance,
  updateAttendance,
  deleteAttendance,
} = require("../controllers/attendanceController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Student attendance tracking
 */

/**
 * @swagger
 * /api/v1/attendance:
 *   post:
 *     summary: Create an attendance record
 *     tags: [Attendance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firebaseUid
 *               - subject
 *               - attended
 *             properties:
 *               firebaseUid:
 *                 type: string
 *                 example: user123
 *               subject:
 *                 type: string
 *                 example: DBMS
 *               attended:
 *                 type: boolean
 *                 example: true
 *               totalClasses:
 *                 type: number
 *                 example: 10
 *               attendedClasses:
 *                 type: number
 *                 example: 9
 *     responses:
 *       201:
 *         description: Attendance record created successfully
 *       400:
 *         description: Invalid attendance data
 */

/**
 * @swagger
 * /api/v1/attendance/{firebaseUid}:
 *   get:
 *     summary: Get attendance records for a student
 *     tags: [Attendance]
 *     parameters:
 *       - in: path
 *         name: firebaseUid
 *         required: true
 *         schema:
 *           type: string
 *         example: user123
 *     responses:
 *       200:
 *         description: Attendance records retrieved successfully
 *       404:
 *         description: Attendance records not found
 */

/**
 * @swagger
 * /api/v1/attendance/{id}:
 *   put:
 *     summary: Update an attendance record
 *     tags: [Attendance]
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
 *             properties:
 *               subject:
 *                 type: string
 *                 example: DBMS
 *               attended:
 *                 type: boolean
 *                 example: false
 *               totalClasses:
 *                 type: number
 *                 example: 11
 *               attendedClasses:
 *                 type: number
 *                 example: 9
 *     responses:
 *       200:
 *         description: Attendance updated successfully
 *       404:
 *         description: Attendance record not found
 */

/**
 * @swagger
 * /api/v1/attendance/{id}:
 *   delete:
 *     summary: Delete an attendance record
 *     tags: [Attendance]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 66f123456789abcdef123456
 *     responses:
 *       200:
 *         description: Attendance deleted successfully
 *       404:
 *         description: Attendance record not found
 */

// CREATE
router.post(
  "/",
  createAttendance
);

// GET
router.get(
  "/:firebaseUid",
  getAttendance
);

// UPDATE
router.put(
  "/:id",
  updateAttendance
);

// DELETE
router.delete(
  "/:id",
  deleteAttendance
);

module.exports = router;