const Skill = require("../models/Skill");

const createSkill = async (req, res, next) => {
  try {
    const {
      career,
      name,
      category,
      importance,
      description,
      prerequisites,
    } = req.body;

    if (
      !career ||
      !name ||
      !category ||
      importance === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Career, skill name, category, and importance are required",
      });
    }

    const skill = await Skill.create({
      career,
      name,
      category,
      importance,
      description,
      prerequisites: prerequisites || [],
    });

    res.status(201).json({
      success: true,
      data: skill,
      message: "Skill created successfully",
    });
  } catch (error) {
    next(error);
  }
};


const getSkillsByCareer = async (req, res, next) => {
  try {
    const { career } = req.params;

    if (!career) {
      return res.status(400).json({
        success: false,
        message: "Career is required",
      });
    }

    const skills = await Skill.find({
      career: {
        $regex: `^${career}$`,
        $options: "i",
      },
    }).sort({
      importance: -1,
    });

    res.status(200).json({
      success: true,
      data: skills,
      message: "Skills fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  createSkill,
  getSkillsByCareer,
};