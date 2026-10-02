const express = require("express");

const {
  createCareerGoal,
  getCareerGoal,
} = require("../controllers/careerGoalController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Career Goals
 *   description: Student career goal management
 */

/**
 * @swagger
 * /api/v1/career-goals:
 *   post:
 *     summary: Create or save a career goal
 *     tags: [Career Goals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firebaseUid
 *               - career
 *             properties:
 *               firebaseUid:
 *                 type: string
 *                 example: user123
 *               career:
 *                 type: string
 *                 example: Data Scientist
 *               description:
 *                 type: string
 *                 example: Build a career in data science and machine learning
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Career goal created successfully
 *       400:
 *         description: Invalid career goal data
 */

/**
 * @swagger
 * /api/v1/career-goals/{firebaseUid}:
 *   get:
 *     summary: Get the career goal of a student
 *     tags: [Career Goals]
 *     parameters:
 *       - in: path
 *         name: firebaseUid
 *         required: true
 *         schema:
 *           type: string
 *         example: user123
 *     responses:
 *       200:
 *         description: Career goal retrieved successfully
 *       404:
 *         description: Career goal not found
 */

// Create career goal
router.post("/", createCareerGoal);

// Get career goal
router.get("/:firebaseUid", getCareerGoal);

module.exports = router;