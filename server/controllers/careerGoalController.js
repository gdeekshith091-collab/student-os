const CareerGoal = require("../models/CareerGoal");

const createCareerGoal = async (req, res, next) => {
  try {
    const {
      firebaseUid,
      career,
      description,
    } = req.body;

    if (!firebaseUid || !career) {
      return res.status(400).json({
        success: false,
        message: "Firebase UID and career are required",
      });
    }

    // Deactivate previous goals
    await CareerGoal.updateMany(
      { firebaseUid },
      { isActive: false }
    );

    const careerGoal = await CareerGoal.create({
      firebaseUid,
      career,
      description,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      data: careerGoal,
      message: "Career goal created successfully",
    });
  } catch (error) {
    next(error);
  }
};


const getCareerGoal = async (req, res, next) => {
  try {
    const { firebaseUid } = req.params;

    if (!firebaseUid) {
      return res.status(400).json({
        success: false,
        message: "Firebase UID is required",
      });
    }

    const careerGoal = await CareerGoal.findOne({
      firebaseUid,
      isActive: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: careerGoal,
      message: careerGoal
        ? "Career goal fetched successfully"
        : "No active career goal found",
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  createCareerGoal,
  getCareerGoal,
};