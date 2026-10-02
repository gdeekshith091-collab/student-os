// =========================================
// STUDENT OS — TODAY'S ROADMAP ROUTES
// =========================================

const express = require("express");

const {
  getTodayRoadmap,
} = require("../controllers/todayRoadmapController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Today Roadmap
 *   description: Personalized daily academic and career roadmap
 */

/**
 * @swagger
 * /api/v1/today-roadmap/{firebaseUid}:
 *   get:
 *     summary: Get today's personalized roadmap
 *     tags: [Today Roadmap]
 *     parameters:
 *       - in: path
 *         name: firebaseUid
 *         required: true
 *         schema:
 *           type: string
 *         example: user123
 *     responses:
 *       200:
 *         description: Today's roadmap retrieved successfully
 *       404:
 *         description: Roadmap data not found
 */

// Get today's roadmap
router.get("/:firebaseUid", getTodayRoadmap);

module.exports = router;