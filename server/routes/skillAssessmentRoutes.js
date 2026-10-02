const express = require("express");

const {
  saveSkillAssessment,
  getStudentSkills,
} = require("../controllers/skillAssessmentController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Skill Assessment
 *   description: Student skill assessment and progress
 */

/**
 * @swagger
 * /api/v1/skill-assessments:
 *   post:
 *     summary: Save or update a student's skill assessment
 *     tags: [Skill Assessment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firebaseUid
 *               - skillId
 *               - score
 *             properties:
 *               firebaseUid:
 *                 type: string
 *                 example: user123
 *               skillId:
 *                 type: string
 *                 example: 66f123456789abcdef123456
 *               score:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 60
 *     responses:
 *       200:
 *         description: Skill assessment saved successfully
 *       400:
 *         description: Invalid assessment data
 */

/**
 * @swagger
 * /api/v1/skill-assessments/{firebaseUid}:
 *   get:
 *     summary: Get all assessed skills of a student
 *     tags: [Skill Assessment]
 *     parameters:
 *       - in: path
 *         name: firebaseUid
 *         required: true
 *         schema:
 *           type: string
 *         example: user123
 *     responses:
 *       200:
 *         description: Student skill assessments retrieved successfully
 *       404:
 *         description: Student skills not found
 */

// Save skill assessment
router.post("/", saveSkillAssessment);

// Get student skills
router.get("/:firebaseUid", getStudentSkills);

module.exports = router;