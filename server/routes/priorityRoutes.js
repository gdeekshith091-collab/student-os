const express = require("express");

const {
  getNextBestActionController,
} = require("../controllers/priorityController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Priority
 *   description: Student priority and next-best-action recommendations
 */

/**
 * @swagger
 * /api/v1/priority/{firebaseUid}/next:
 *   get:
 *     summary: Get the student's next best action
 *     tags: [Priority]
 *     parameters:
 *       - in: path
 *         name: firebaseUid
 *         required: true
 *         schema:
 *           type: string
 *         example: user123
 *     responses:
 *       200:
 *         description: Next best action calculated successfully
 *       404:
 *         description: No suitable action found
 */

// GET STUDENT'S NEXT BEST ACTION
router.get(
  "/:firebaseUid/next",
  getNextBestActionController
);

module.exports = router;