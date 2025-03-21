import React, { useState } from "react";
import axios from "axios";

const CandidateForm = ({ fetchCandidates }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    // Validation before submitting
    if (!formData.name || !formData.email || !formData.phone || !formData.position) {
      setError("All fields are required.");
      setIsLoading(false);
      return;
    }

    // Simple email validation regex
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(formData.email)) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    // Simple phone number validation (just checks for numbers)
    if (!/^\d+$/.test(formData.phone)) {
      setError("Phone number should only contain digits.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/candidates", formData);
      setSuccess(response.data.message || "Candidate added successfully!");
      setFormData({ name: "", email: "", phone: "", position: "" });
      fetchCandidates(); // Re-fetch the candidate list after adding
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.error || "An error occurred. Please try again.");
      } else {
        setError("Unable to connect to the server.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: "20px",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        maxWidth: "100%",
      }}
    >
      {error && <p style={{ color: "red", width: "100%" }}>{error}</p>}
      {success && <p style={{ color: "green", width: "100%" }}>{success}</p>}

      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
        style={{
          padding: "10px",
          flex: "1 1 200px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        style={{
          padding: "10px",
          flex: "1 1 200px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
      <input
        type="tel"
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
        required
        style={{
          padding: "10px",
          flex: "1 1 200px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
      <input
        type="text"
        name="position"
        placeholder="Position"
        value={formData.position}
        onChange={handleChange}
        required
        style={{
          padding: "10px",
          flex: "1 1 200px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
      <button
        type="submit"
        disabled={isLoading}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: isLoading ? "not-allowed" : "pointer",
        }}
      >
        {isLoading ? "Adding..." : "Add Candidate"}
      </button>
    </form>
  );
};

export default CandidateForm;
