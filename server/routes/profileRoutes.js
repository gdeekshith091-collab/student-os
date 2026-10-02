const express = require("express");

const {
  getProfile,
  saveProfile,
} = require("../controllers/profileController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: Student profile management
 */

/**
 * @swagger
 * /api/v1/profile/{firebaseUid}:
 *   get:
 *     summary: Get a student's profile
 *     tags: [Profile]
 *     parameters:
 *       - in: path
 *         name: firebaseUid
 *         required: true
 *         schema:
 *           type: string
 *         example: user123
 *     responses:
 *       200:
 *         description: Student profile retrieved successfully
 *       404:
 *         description: Student profile not found
 */

/**
 * @swagger
 * /api/v1/profile/{firebaseUid}:
 *   put:
 *     summary: Create or update a student's profile
 *     tags: [Profile]
 *     parameters:
 *       - in: path
 *         name: firebaseUid
 *         required: true
 *         schema:
 *           type: string
 *         example: user123
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ammu
 *               email:
 *                 type: string
 *                 format: email
 *                 example: student@example.com
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               college:
 *                 type: string
 *                 example: Sapthagiri NPS University
 *               course:
 *                 type: string
 *                 example: B.Tech CSE - Data Science
 *               semester:
 *                 type: string
 *                 example: 4th Semester
 *               careerGoal:
 *                 type: string
 *                 example: Data Scientist
 *               profilePhotoUrl:
 *                 type: string
 *                 example: https://example.com/profile.jpg
 *               preferences:
 *                 type: object
 *                 properties:
 *                   font:
 *                     type: string
 *                     example: Inter
 *                   fontSize:
 *                     type: string
 *                     enum: [Small, Medium, Large]
 *                     example: Medium
 *     responses:
 *       200:
 *         description: Student profile saved successfully
 *       400:
 *         description: Invalid profile data
 */

// GET student profile
router.get(
  "/:firebaseUid",
  getProfile
);

// CREATE / UPDATE student profile
router.put(
  "/:firebaseUid",
  saveProfile
);

module.exports = router;