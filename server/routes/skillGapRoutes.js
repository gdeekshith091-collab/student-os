const express = require("express");

const {
  getSkillGaps,
} = require("../controllers/skillGapController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Skill Gaps
 *   description: Career skill gap analysis
 */

/**
 * @swagger
 * /api/v1/skill-gaps/{firebaseUid}:
 *   get:
 *     summary: Get skill gaps for a student
 *     tags: [Skill Gaps]
 *     parameters:
 *       - in: path
 *         name: firebaseUid
 *         required: true
 *         schema:
 *           type: string
 *         example: user123
 *     responses:
 *       200:
 *         description: Skill gaps calculated successfully
 *       404:
 *         description: Student or career skill data not found
 */

router.get("/:firebaseUid", getSkillGaps);

module.exports = router;