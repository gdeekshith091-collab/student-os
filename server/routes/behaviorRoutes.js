const express = require("express");

const {
  getBehavior,
} = require("../controllers/behaviorController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Behavior
 *   description: Student study behavior analysis and adaptation
 */

/**
 * @swagger
 * /api/v1/behavior/{firebaseUid}:
 *   get:
 *     summary: Get behavior analysis for a student
 *     tags: [Behavior]
 *     parameters:
 *       - in: path
 *         name: firebaseUid
 *         required: true
 *         schema:
 *           type: string
 *         example: user123
 *     responses:
 *       200:
 *         description: Behavior analysis retrieved successfully
 *       404:
 *         description: Student behavior data not found
 */

router.get("/:firebaseUid", getBehavior);

module.exports = router;