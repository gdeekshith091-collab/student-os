const express = require("express");

const {
  createUser,
  getUser,
  updateSemester,
} = require("../controllers/userController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Student user management
 */

/**
 * @swagger
 * /api/v1/users/createUser:
 *   post:
 *     summary: Create a student user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firebaseUid
 *             properties:
 *               firebaseUid:
 *                 type: string
 *                 example: user123
 *               name:
 *                 type: string
 *                 example: Ammu
 *               email:
 *                 type: string
 *                 format: email
 *                 example: student@example.com
 *               semester:
 *                 type: string
 *                 example: 4th Semester
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid user data
 */

/**
 * @swagger
 * /api/v1/users/getUser/{firebaseUid}:
 *   get:
 *     summary: Get a student user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: firebaseUid
 *         required: true
 *         schema:
 *           type: string
 *         example: user123
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/v1/users/semester:
 *   put:
 *     summary: Update a student's semester
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firebaseUid
 *               - semester
 *             properties:
 *               firebaseUid:
 *                 type: string
 *                 example: user123
 *               semester:
 *                 type: string
 *                 example: 4th Semester
 *     responses:
 *       200:
 *         description: Semester updated successfully
 *       404:
 *         description: User not found
 */

// CREATE USER
router.post(
  "/createUser",
  createUser
);

// GET USER
router.get(
  "/getUser/:firebaseUid",
  getUser
);

// UPDATE SEMESTER
router.put(
  "/semester",
  updateSemester
);

module.exports = router;