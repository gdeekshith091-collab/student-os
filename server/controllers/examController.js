const Exam = require("../models/Exam");

// =========================================
// CREATE EXAM
// =========================================

const createExam = async (req, res) => {
  try {
    const {
      firebaseUid,
      subject,
      examDate,
      examType,
      importance,
    } = req.body;

    if (!firebaseUid || !subject || !examDate) {
      return res.status(400).json({
        success: false,
        message:
          "Firebase UID, subject, and exam date are required",
      });
    }

    const exam = await Exam.create({
      firebaseUid,
      subject,
      examDate,
      examType,
      importance,
    });

    return res.status(201).json({
      success: true,
      message: "Exam created successfully",
      data: exam,
    });
  } catch (error) {
    console.error("Create exam error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create exam",
      error: error.message,
    });
  }
};


// =========================================
// GET ALL EXAMS
// =========================================

const getExams = async (req, res) => {
  try {
    const { firebaseUid } = req.params;

    if (!firebaseUid) {
      return res.status(400).json({
        success: false,
        message: "Firebase UID is required",
      });
    }

    const exams = await Exam.find({
      firebaseUid,
    }).sort({
      examDate: 1,
    });

    return res.status(200).json({
      success: true,
      data: exams,
    });
  } catch (error) {
    console.error("Get exams error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch exams",
      error: error.message,
    });
  }
};


// =========================================
// UPDATE EXAM STATUS
// =========================================

const updateExamStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const exam = await Exam.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Exam status updated successfully",
      data: exam,
    });
  } catch (error) {
    console.error(
      "Update exam status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update exam status",
      error: error.message,
    });
  }
};


// =========================================
// DELETE EXAM
// =========================================

const deleteExam = async (req, res) => {
  try {
    const { id } = req.params;

    const exam = await Exam.findByIdAndDelete(id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Exam deleted successfully",
    });
  } catch (error) {
    console.error("Delete exam error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete exam",
      error: error.message,
    });
  }
};


// =========================================
// EXPORT
// =========================================

module.exports = {
  createExam,
  getExams,
  updateExamStatus,
  deleteExam,
};