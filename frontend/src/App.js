import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar";
import CandidateForm from "./components/CandidateForm";
import CandidateList from "./components/CandidateList";
import Login from "./components/Login";
import Analytics from "./components/Analytics"; // Assuming you have Analytics
import Notifications from "./components/Notifications"; // Assuming you have Notifications
import UserManagement from "./components/UserManagement"; // Assuming you have User Management

const App = () => {
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState(""); // State for handling errors
  const [success, setSuccess] = useState(""); // State for handling success messages
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken") || null); // Auth token state

  // Fetch all candidates
  const fetchCandidates = async () => {
    try {
      setError(""); // Clear previous errors
      const response = await axios.get("http://localhost:5000/api/candidates", {
        headers: { Authorization: `Bearer ${authToken}` }, // Add token to requests
      });

      // Ensure the application_date is in the correct format (ISO 8601) if it's not
      const formattedCandidates = response.data.map((candidate) => ({
        ...candidate,
        application_date: new Date(candidate.application_date).toISOString().split("T")[0],
      }));

      setCandidates(formattedCandidates);
    } catch (error) {
      setError("Error fetching candidates. Please try again later.");
      console.error("Error fetching candidates:", error);
    }
  };

  // Add a new candidate
  const addCandidate = async (newCandidate) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/candidates",
        newCandidate,
        {
          headers: { Authorization: `Bearer ${authToken}` }, // Add token to requests
        }
      );
      setCandidates((prev) => [...prev, response.data.candidate]);
      setSuccess("Candidate added successfully!"); // Success message after adding
    } catch (error) {
      console.error("Error adding candidate:", error);
      setError("Error adding candidate. Please try again later.");
    }
  };

  // Edit an existing candidate
  const editCandidate = async (updatedCandidate) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/candidates/${updatedCandidate.id}`,
        updatedCandidate,
        {
          headers: { Authorization: `Bearer ${authToken}` }, // Add token to requests
        }
      );

      // Update the candidate list after successful edit
      setCandidates((prev) =>
        prev.map((candidate) =>
          candidate.id === updatedCandidate.id ? response.data.candidate : candidate
        )
      );
      setSuccess("Candidate updated successfully!");
    } catch (error) {
      console.error("Error editing candidate:", error);
      setError("Error editing candidate. Please try again later.");
    }
  };

  // Delete a candidate
  const deleteCandidate = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this candidate?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/candidates/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` }, // Add token to requests
      });
      setCandidates((prev) => prev.filter((candidate) => candidate.id !== id)); // Dynamically update UI
      alert("Candidate deleted successfully.");
    } catch (error) {
      console.error("Error deleting candidate:", error);
      alert("Error deleting candidate. Please try again later.");
    }
  };

  // Fetch candidates when the component mounts if the user is logged in
  useEffect(() => {
    if (authToken) fetchCandidates();
  }, [authToken]);

  // Handle login
  const handleLogin = (token) => {
    setAuthToken(token);
    localStorage.setItem("authToken", token);
  };

  // Handle logout
  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem("authToken");
  };

  return (
    <Router>
      <Navbar onLogout={handleLogout} authToken={authToken} />
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      {success && <p style={{ color: "green", textAlign: "center" }}>{success}</p>}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={authToken ? (
            <>
              <CandidateForm onAddCandidate={addCandidate} />
              <CandidateList
                candidates={candidates}
                onEditCandidate={editCandidate}
                onDeleteCandidate={deleteCandidate}
              />
            </>
          ) : (
            <Navigate to="/login" />
          )}
        />
        <Route
          path="/analytics"
          element={authToken ? <Analytics /> : <Navigate to="/login" />}
        />
        <Route
          path="/notifications"
          element={authToken ? <Notifications /> : <Navigate to="/login" />}
        />
        <Route
          path="/user-management"
          element={authToken ? <UserManagement /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
