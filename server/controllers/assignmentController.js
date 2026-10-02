const Assignment = require("../models/Assignment");
const {
  calculateAcademicRisk,
} = require("../services/academicRiskEngine");

const createAssignment = async (req, res, next) => {
  try {
    const {
      firebaseUid,
      subjectId,
      title,
      description,
      dueDate,
      priority,
      estimatedHours,
    } = req.body;

    if (!firebaseUid) {
      return res.status(400).json({
        success: false,
        message: "Firebase UID is required",
      });
    }

    if (!subjectId) {
      return res.status(400).json({
        success: false,
        message: "Subject ID is required",
      });
    }

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Assignment title is required",
      });
    }

    if (!dueDate) {
      return res.status(400).json({
        success: false,
        message: "Due date is required",
      });
    }

    const assignment = await Assignment.create({
      firebaseUid,
      subjectId,
      title,
      description: description || "",
      dueDate,
      priority: priority || "Medium",
      estimatedHours: Number(estimatedHours) || 1,
    });

    res.status(201).json({
      success: true,
      data: assignment,
      message: "Assignment created successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getAssignments = async (req, res, next) => {
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
    }).sort({
      dueDate: 1,
    });

    res.status(200).json({
      success: true,
      data: assignments,
      message: "Assignments fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updateAssignmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { firebaseUid, status } = req.body;

    if (!firebaseUid) {
      return res.status(400).json({
        success: false,
        message: "Firebase UID is required",
      });
    }

    const validStatuses = [
      "Pending",
      "In Progress",
      "Completed",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assignment status",
      });
    }

    const assignment = await Assignment.findOneAndUpdate(
      {
        _id: id,
        firebaseUid,
      },
      {
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!assignment) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Assignment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: assignment,
      message: "Assignment status updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const deleteAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { firebaseUid } = req.body;

    if (!firebaseUid) {
      return res.status(400).json({
        success: false,
        message: "Firebase UID is required",
      });
    }

    const assignment = await Assignment.findOneAndDelete({
      _id: id,
      firebaseUid,
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Assignment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: assignment,
      message: "Assignment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
const getAcademicRisk = async (req, res, next) => {
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

    const risk = calculateAcademicRisk(assignments);

    res.status(200).json({
      success: true,
      data: risk,
      message: "Academic risk calculated successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAssignment,
  getAssignments,
  updateAssignmentStatus,
  deleteAssignment,
  getAcademicRisk,
};