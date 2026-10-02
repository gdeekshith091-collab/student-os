const express = require("express");

const {
  createSkill,
  getSkillsByCareer,
} = require("../controllers/skillController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Skills
 *   description: Career skill and SkillGraph management
 */

/**
 * @swagger
 * /api/v1/skills:
 *   post:
 *     summary: Create a career skill
 *     tags: [Skills]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - career
 *               - name
 *               - category
 *               - importance
 *             properties:
 *               career:
 *                 type: string
 *                 example: Data Scientist
 *               name:
 *                 type: string
 *                 example: Machine Learning
 *               category:
 *                 type: string
 *                 example: AI/ML
 *               importance:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 10
 *                 example: 10
 *               score:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 40
 *               description:
 *                 type: string
 *                 example: Build and evaluate machine learning models
 *               prerequisites:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Python
 *                   - Statistics
 *     responses:
 *       201:
 *         description: Skill created successfully
 *       400:
 *         description: Invalid skill data
 */

/**
 * @swagger
 * /api/v1/skills/career/{career}:
 *   get:
 *     summary: Get skills for a career
 *     tags: [Skills]
 *     parameters:
 *       - in: path
 *         name: career
 *         required: true
 *         schema:
 *           type: string
 *         example: Data%20Scientist
 *     responses:
 *       200:
 *         description: Career skills retrieved successfully
 *       404:
 *         description: No skills found for the career
 */

// Create skill
router.post("/", createSkill);

// Get skills by career
router.get("/career/:career", getSkillsByCareer);

module.exports = router;