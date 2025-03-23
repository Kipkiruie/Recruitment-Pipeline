const Interview = require("../models/Interview");

const scheduleInterview = async (req, res) => {
  const { candidateId, date, interviewer } = req.body;
  try {
    const interview = await Interview.create({ candidateId, date, interviewer });
    res.status(201).json(interview);
  } catch (error) {
    res.status(400).json({ message: "Error scheduling interview" });
  }
};

const getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find().populate("candidateId", "name email position");
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching interviews" });
  }
};

module.exports = { scheduleInterview, getInterviews };
