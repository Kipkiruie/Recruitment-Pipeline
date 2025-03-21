import React, { useState, useEffect } from "react";

const CandidateList = ({ candidates, onEditCandidate, onDeleteCandidate }) => {
  const [editingCandidateId, setEditingCandidateId] = useState(null);
  const [editedCandidate, setEditedCandidate] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleEditClick = (candidate) => {
    setEditingCandidateId(candidate.id);
    setEditedCandidate({ ...candidate });
  };

  const handleCancelEdit = () => {
    setEditingCandidateId(null);
    setEditedCandidate({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCandidate({ ...editedCandidate, [name]: value });
  };

  const handleSaveEdit = () => {
    if (!editedCandidate.name || !editedCandidate.email || !editedCandidate.phone || !editedCandidate.position) {
      setError("All fields are required for editing.");
      return;
    }
    onEditCandidate(editedCandidate);
    setSuccess("Candidate updated successfully!");
    setEditingCandidateId(null);
  };

  const handleDelete = (id) => {
    onDeleteCandidate(id);
    setSuccess("Candidate deleted successfully!");
  };

  const getStatusStyle = (status) => {
    if (status === "Pending") {
      return { backgroundColor: "yellow", color: "black" };
    } else if (status === "Reviewed") {
      return { backgroundColor: "green", color: "white" };
    }
    return {};
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    console.log(candidates); // Log the candidates to check the structure
  }, [candidates]);

  return (
    <div>
      <h2>Candidate List</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <table
        border="1"
        cellPadding="5"
        style={{
          width: "100%",
          textAlign: "left",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Position</th>
            <th>Application Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate) => (
            <tr key={candidate.id}>
              {editingCandidateId === candidate.id ? (
                <>
                  <td>
                    <input
                      type="text"
                      name="name"
                      value={editedCandidate.name || ""}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="email"
                      name="email"
                      value={editedCandidate.email || ""}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="phone"
                      value={editedCandidate.phone || ""}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="position"
                      value={editedCandidate.position || ""}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>{candidate.application_date || "N/A"}</td>
                  <td>
                    <select
                      name="status"
                      value={editedCandidate.status || ""}
                      onChange={handleInputChange}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Reviewed">Reviewed</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={handleSaveEdit}>Save</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{candidate.name}</td>
                  <td>{candidate.email}</td>
                  <td>{candidate.phone || ""}</td>
                  <td>{candidate.position || ""}</td>
                  <td>{formatDate(candidate.application_date)}</td>
                  <td style={getStatusStyle(candidate.status)}>
                    {candidate.status}
                  </td>
                  <td>
                    <button
                      onClick={() => handleEditClick(candidate)}
                      style={{ marginRight: "10px" }}
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDelete(candidate.id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CandidateList;
