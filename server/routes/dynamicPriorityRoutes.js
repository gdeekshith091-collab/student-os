const express = require("express");

const {
  getDynamicPriority,
} = require("../controllers/dynamicPriorityController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Dynamic Priority
 *   description: Adaptive academic and career priority recommendations
 */

/**
 * @swagger
 * /api/v1/dynamic-priority/{firebaseUid}:
 *   get:
 *     summary: Get the student's dynamic priority
 *     tags: [Dynamic Priority]
 *     parameters:
 *       - in: path
 *         name: firebaseUid
 *         required: true
 *         schema:
 *           type: string
 *         example: user123
 *     responses:
 *       200:
 *         description: Dynamic priority calculated successfully
 *       404:
 *         description: Student data not found
 */

router.get("/:firebaseUid", getDynamicPriority);

module.exports = router;