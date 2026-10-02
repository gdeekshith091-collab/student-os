const StudentProfile = require("../models/StudentProfile");

// =========================================
// GET PROFILE
// =========================================

const getProfile = async (req, res, next) => {
  try {
    const { firebaseUid } = req.params;

    if (!firebaseUid) {
      return res.status(400).json({
        success: false,
        message: "Firebase UID is required",
      });
    }

    let profile = await StudentProfile.findOne({
      firebaseUid,
    });

    // Create an empty profile if one doesn't exist
    if (!profile) {
      profile = await StudentProfile.create({
        firebaseUid,
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
      message: "Student profile fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

// =========================================
// CREATE / UPDATE PROFILE
// =========================================

const saveProfile = async (req, res, next) => {
  try {
    const {
      firebaseUid,
      name,
      email,
      phone,
      college,
      course,
      semester,
      careerGoal,
      profilePhotoUrl,
      preferences,
    } = req.body;

    if (!firebaseUid) {
      return res.status(400).json({
        success: false,
        message: "Firebase UID is required",
      });
    }

    const profile =
      await StudentProfile.findOneAndUpdate(
        { firebaseUid },
        {
          firebaseUid,
          name: name || "",
          email: email || "",
          phone: phone || "",
          college: college || "",
          course: course || "",
          semester: semester || "",
          careerGoal: careerGoal || "",
          profilePhotoUrl:
            profilePhotoUrl || "",
          preferences: {
            font:
              preferences?.font ||
              "Inter",

            fontSize:
              preferences?.fontSize ||
              "Medium",
          },
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      success: true,
      data: profile,
      message:
        "Student profile saved successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  saveProfile,
};