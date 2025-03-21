const express = require('express');

const recruitmentRoutes = (db) => {
  const router = express.Router();

  // Get all candidates
  router.get('/candidates', (req, res) => {
    db.query('SELECT * FROM candidates', (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching candidates', error: err });
      }
      res.json(results);
    });
  });

  // Create a new candidate
  router.post('/candidates', (req, res) => {
    const { name, email, phone, status, notes } = req.body;
    const query = 'INSERT INTO candidates (name, email, phone, status, notes) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [name, email, phone, status, notes], (err, result) => {
      if (err) {
        return res.status(400).json({ message: 'Error creating candidate', error: err });
      }
      res.status(201).json({ id: result.insertId, name, email, phone, status, notes });
    });
  });

  // Update a candidate
  router.put('/candidates/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, phone, status, notes } = req.body;
    const query = 'UPDATE candidates SET name = ?, email = ?, phone = ?, status = ?, notes = ? WHERE id = ?';
    db.query(query, [name, email, phone, status, notes, id], (err) => {
      if (err) {
        return res.status(400).json({ message: 'Error updating candidate', error: err });
      }
      res.json({ message: 'Candidate updated successfully' });
    });
  });

  // Delete a candidate
  router.delete('/candidates/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM candidates WHERE id = ?';
    db.query(query, [id], (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error deleting candidate', error: err });
      }
      res.json({ message: 'Candidate deleted successfully' });
    });
  });

  return router;
};

module.exports = recruitmentRoutes;
