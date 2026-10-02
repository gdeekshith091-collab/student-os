const express = require("express");

const {
  createTimetableEntry,
  getTimetable,
  updateTimetableEntry,
  deleteTimetableEntry,
} = require("../controllers/timetableController");

const {
  scanTimetable,
} = require("../controllers/timetableScannerController");

const multer = require("multer");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

/**
 * @swagger
 * tags:
 *   name: Timetable
 *   description: Student timetable management
 */

/**
 * @swagger
 * /api/v1/timetable/scan:
 *   post:
 *     summary: Scan a timetable file using the timetable scanner
 *     tags: [Timetable]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Timetable image or document
 *     responses:
 *       200:
 *         description: Timetable scanned successfully
 *       400:
 *         description: Invalid or missing file
 */

/**
 * @swagger
 * /api/v1/timetable:
 *   post:
 *     summary: Create a timetable entry
 *     tags: [Timetable]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firebaseUid:
 *                 type: string
 *                 example: user123
 *               subject:
 *                 type: string
 *                 example: Database Management Systems
 *               day:
 *                 type: string
 *                 example: Monday
 *               startTime:
 *                 type: string
 *                 example: 09:00
 *               endTime:
 *                 type: string
 *                 example: 10:00
 *               room:
 *                 type: string
 *                 example: Lab 2
 *     responses:
 *       201:
 *         description: Timetable entry created successfully
 *       400:
 *         description: Invalid timetable data
 */

/**
 * @swagger
 * /api/v1/timetable/{firebaseUid}:
 *   get:
 *     summary: Get a student's timetable
 *     tags: [Timetable]
 *     parameters:
 *       - in: path
 *         name: firebaseUid
 *         required: true
 *         schema:
 *           type: string
 *         example: user123
 *     responses:
 *       200:
 *         description: Timetable retrieved successfully
 *       404:
 *         description: Timetable not found
 */

/**
 * @swagger
 * /api/v1/timetable/{id}:
 *   put:
 *     summary: Update a timetable entry
 *     tags: [Timetable]
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
 *                 example: Machine Learning
 *               day:
 *                 type: string
 *                 example: Tuesday
 *               startTime:
 *                 type: string
 *                 example: 10:00
 *               endTime:
 *                 type: string
 *                 example: 11:00
 *               room:
 *                 type: string
 *                 example: Room 204
 *     responses:
 *       200:
 *         description: Timetable entry updated successfully
 *       404:
 *         description: Timetable entry not found
 */

/**
 * @swagger
 * /api/v1/timetable/{id}:
 *   delete:
 *     summary: Delete a timetable entry
 *     tags: [Timetable]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 66f123456789abcdef123456
 *     responses:
 *       200:
 *         description: Timetable entry deleted successfully
 *       404:
 *         description: Timetable entry not found
 */

// AI TIMETABLE SCANNER
router.post(
  "/scan",
  upload.single("file"),
  scanTimetable
);

// CREATE
router.post(
  "/",
  createTimetableEntry
);

// GET
router.get(
  "/:firebaseUid",
  getTimetable
);

// UPDATE
router.put(
  "/:id",
  updateTimetableEntry
);

// DELETE
router.delete(
  "/:id",
  deleteTimetableEntry
);

module.exports = router;