const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", required: true },
  stage: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Progress", ProgressSchema);
