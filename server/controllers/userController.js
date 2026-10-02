const User = require("../models/User");

const createUser = async (req, res, next) => {
  try {
    const {
      firebaseUid,
      name,
      email,
      profileImage,
      college,
      course,
      year,
      semester,
      timezone,
    } = req.body;

    const existingUser = await User.findOne({ firebaseUid });

    if (existingUser) {
      return res.status(200).json({
        success: true,
        data: existingUser,
        message: "User already exists",
      });
    }

    const user = await User.create({
      firebaseUid,
      name,
      email,
      profileImage,
      college,
      course,
      year,
      semester,
      timezone,
    });

    res.status(201).json({
      success: true,
      data: user,
      message: "User created successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      firebaseUid: req.params.firebaseUid,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
      message: "User fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};


/*
  Update semester information and subjects
*/
const updateSemester = async (req, res, next) => {
  try {
    const {
      firebaseUid,
      semester,
      subjects,
    } = req.body;

    if (!firebaseUid) {
      return res.status(400).json({
        success: false,
        message: "Firebase UID is required",
      });
    }

    if (!semester) {
      return res.status(400).json({
        success: false,
        message: "Semester is required",
      });
    }

    const user = await User.findOneAndUpdate(
      { firebaseUid },
      {
        semester: Number(semester),
        subjects: subjects || [],
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
      message: "Semester information updated successfully",
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  createUser,
  getUser,
  updateSemester,
};