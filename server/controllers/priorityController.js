const Assignment = require("../models/Assignment");

const {
  getNextBestAction,
} = require("../services/priorityEngine");


const getNextBestActionController = async (req, res, next) => {
  try {
    const { firebaseUid } = req.params;

    if (!firebaseUid) {
      return res.status(400).json({
        success: false,
        message: "Firebase UID is required",
      });
    }

    const assignments = await Assignment.find({
      firebaseUid,
    });

    const recommendation =
      getNextBestAction(assignments);

    res.status(200).json({
      success: true,
      data: recommendation,
      message: "Next best action calculated successfully",
    });

  } catch (error) {
    next(error);
  }
};


module.exports = {
  getNextBestActionController,
};