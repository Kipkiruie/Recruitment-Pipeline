const mongoose = require("mongoose");

const InterviewSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", required: true },
  date: { type: Date, required: true },
  interviewer: { type: String, required: true },
  status: { type: String, enum: ["Scheduled", "Completed", "Cancelled"], default: "Scheduled" },
});

module.exports = mongoose.model("Interview", InterviewSchema);
