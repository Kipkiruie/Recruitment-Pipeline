import React, { useState, useEffect } from "react";
import axios from "axios";

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/analytics", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setAnalytics(response.data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };

    fetchAnalytics();
  }, []);

  if (!analytics) return <p>Loading...</p>;

  return (
    <div>
      <h3>Analytics</h3>
      <ul>
        <li>Total Candidates: {analytics.totalCandidates}</li>
        <li>Accepted Candidates: {analytics.acceptedCandidates}</li>
        <li>Rejected Candidates: {analytics.rejectedCandidates}</li>
        <li>Pending Candidates: {analytics.pendingCandidates}</li>
      </ul>
    </div>
  );
};

export default Analytics;
