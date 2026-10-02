// =========================================
// STUDENT OS — PROGRESS ROUTES
// =========================================

const express = require("express");

const {
  getProgress,
} = require("../controllers/progressController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Progress
 *   description: Student academic and career progress tracking
 */

/**
 * @swagger
 * /api/v1/progress/{firebaseUid}:
 *   get:
 *     summary: Get student progress
 *     tags: [Progress]
 *     parameters:
 *       - in: path
 *         name: firebaseUid
 *         required: true
 *         schema:
 *           type: string
 *         example: user123
 *     responses:
 *       200:
 *         description: Student progress retrieved successfully
 *       404:
 *         description: Student progress data not found
 */

// Get student progress
router.get("/:firebaseUid", getProgress);

module.exports = router;