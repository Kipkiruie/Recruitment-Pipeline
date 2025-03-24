import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar";
import CandidateForm from "./components/CandidateForm";
import CandidateList from "./components/CandidateList";
import Login from "./components/Login";
import Analytics from "./components/Analytics";
import Notifications from "./components/Notifications";
import UserManagement from "./components/UserManagement";

const App = () => {
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState(""); // Error message state
  const [success, setSuccess] = useState(""); // Success message state
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken") || null);

  // Automatically clear success/error messages after 3 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // Fetch candidates data from the API
  const fetchCandidates = useCallback(async () => {
    if (!authToken) return;
    try {
      setError(""); // Clear any previous error
      const response = await axios.get("http://localhost:5000/api/candidates", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setCandidates(response.data);
    } catch (err) {
      setError("Error fetching candidates. Please try again.");
      console.error("Fetch error:", err);
    }
  }, [authToken]);

  // Add a new candidate
  const addCandidate = async (newCandidate) => {
    try {
      const response = await axios.post("http://localhost:5000/api/candidates", newCandidate, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setCandidates((prev) => [...prev, response.data]);
      setSuccess("Candidate added successfully!");
    } catch (err) {
      setError("Error adding candidate. Please try again.");
      console.error("Add error:", err);
    }
  };

  // Edit an existing candidate
  const editCandidate = async (updatedCandidate) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/candidates/${updatedCandidate.id}`,
        updatedCandidate,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setCandidates((prev) =>
        prev.map((candidate) =>
          candidate.id === updatedCandidate.id ? response.data : candidate
        )
      );
      setSuccess("Candidate updated successfully!");
    } catch (err) {
      setError("Error updating candidate. Please try again.");
      console.error("Edit error:", err);
    }
  };

  // Delete a candidate
  const deleteCandidate = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this candidate?");
    if (!confirmDelete) return;
    try {
      await axios.delete(`http://localhost:5000/api/candidates/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setCandidates((prev) => prev.filter((candidate) => candidate.id !== id));
      setSuccess("Candidate deleted successfully.");
    } catch (err) {
      setError("Error deleting candidate. Please try again.");
      console.error("Delete error:", err);
    }
  };

  // Fetch candidates when the component mounts
  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  // Handle login
  const handleLogin = (token) => {
    setAuthToken(token);
    localStorage.setItem("authToken", token);
    setSuccess("Login successful!");
  };

  // Handle logout
  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem("authToken");
    setSuccess("Logged out successfully.");
  };

  return (
    <Router>
      <Navbar onLogout={handleLogout} authToken={authToken} />
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      {success && <p style={{ color: "green", textAlign: "center" }}>{success}</p>}
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            authToken ? (
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
            )
          }
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
