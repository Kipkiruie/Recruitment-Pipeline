const Progress = require("../models/Progress");

const getProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ candidateId: req.params.id });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: "Error fetching progress" });
  }
};

const addProgress = async (req, res) => {
  try {
    const { candidateId, stage } = req.body;
    const progress = await Progress.create({ candidateId, stage });
    res.status(201).json(progress);
  } catch (error) {
    res.status(400).json({ message: "Error adding progress" });
  }
};

module.exports = { getProgress, addProgress };
