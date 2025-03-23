const Candidate = require("../models/Candidate");

const getDashboardData = async (req, res) => {
  try {
    const totalApplications = await Candidate.countDocuments();
    const positions = await Candidate.aggregate([
      { $group: { _id: "$position", count: { $sum: 1 } } },
    ]);
    res.json({ totalApplications, positions });
  } catch (error) {
    res.status(500).json({ message: "Error fetching analytics data" });
  }
};

module.exports = { getDashboardData };
const Candidate = require("../models/Candidate");

const getAnalytics = async (req, res) => {
  try {
    const totalCandidates = await Candidate.countDocuments();
    const acceptedCandidates = await Candidate.countDocuments({ status: "Accepted" });
    const rejectedCandidates = await Candidate.countDocuments({ status: "Rejected" });
    const pendingCandidates = await Candidate.countDocuments({ status: "Pending" });

    res.json({
      totalCandidates,
      acceptedCandidates,
      rejectedCandidates,
      pendingCandidates,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching analytics" });
  }
};

module.exports = { getAnalytics };
