import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import CandidateForm from "./components/CandidateForm";
import CandidateList from "./components/CandidateList";

const App = () => {
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState(""); // State for handling errors
  const [success, setSuccess] = useState(""); // State for handling success messages

  // Fetch all candidates
  const fetchCandidates = async () => {
    try {
      setError(""); // Clear previous errors
      const response = await axios.get("http://localhost:5000/api/candidates");
      
      // Ensure the application_date is in the correct format (ISO 8601) if it's not
      const formattedCandidates = response.data.map(candidate => ({
        ...candidate,
        application_date: new Date(candidate.application_date).toISOString().split('T')[0],
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
      const response = await axios.post("http://localhost:5000/api/candidates", newCandidate);
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
      const { id, name, email, phone, position, status } = updatedCandidate;

      // Check if any required field is missing before sending the request
      if (!name || !email || !phone || !position || !status) {
        setError("All fields are required.");
        return;
      }
  
      const response = await axios.put(
        `http://localhost:5000/api/candidates/${id}`,
        updatedCandidate
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
      if (error.response?.status === 400) {
        setError("Bad request. Please check the form fields and try again.");
      } else {
        setError("Error editing candidate. Please try again later.");
      }
    }
  };

  // Delete a candidate
  const deleteCandidate = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this candidate?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`http://localhost:5000/api/candidates/${id}`);
      console.log(response.data.message); // Log the success message
      setCandidates((prev) => prev.filter((candidate) => candidate.id !== id)); // Dynamically update UI
      alert(response.data.message); // Show a confirmation to the user
    } catch (error) {
      console.error("Error deleting candidate:", error);
      if (error.response?.data?.error) {
        alert(error.response.data.error); // Show specific error message
      } else {
        alert("Error deleting candidate. Please try again later.");
      }
    }
  };

  // Fetch candidates when the component mounts
  useEffect(() => {
    fetchCandidates();
  }, []);

  return (
    <div>
      <Navbar />
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      {success && <p style={{ color: "green", textAlign: "center" }}>{success}</p>} {/* Display success message */}
      <CandidateForm onAddCandidate={addCandidate} />
      <CandidateList
        candidates={candidates}
        onEditCandidate={editCandidate}
        onDeleteCandidate={deleteCandidate}
      />
    </div>
  );
};

export default App;
