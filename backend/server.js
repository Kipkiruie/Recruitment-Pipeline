const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for all requests
app.use(express.json()); // Parse JSON request bodies
app.options('*', cors()); // Handle CORS preflight requests for all routes

// Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        process.exit(1); // Exit if the database connection fails
    }
    console.log('Connected to MySQL database.');
});

// API Routes

// Fetch all candidates
app.get('/api/candidates', (req, res) => {
    const sql = 'SELECT * FROM candidates';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database query error:', err.message);
            return res.status(500).json({ error: 'Database query error' });
        }

        const formattedResults = results.map((candidate) => ({
            ...candidate,
            position: candidate.position_applied, // Alias position_applied as position
            application_date: new Date(candidate.application_date).toISOString().split('T')[0],
        }));

        res.json(formattedResults);
    });
});

// Add a new candidate
app.post('/api/candidates', (req, res) => {
    const { name, email, phone, position } = req.body;

    if (!name || !email || !phone || !position) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const sql = `
        INSERT INTO candidates (name, email, phone, position_applied, application_date, status) 
        VALUES (?, ?, ?, ?, CURDATE(), 'Pending')`;
    db.query(sql, [name, email, phone, position], (err, result) => {
        if (err) {
            console.error('Database insert error:', err.message);
            return res.status(500).json({ error: 'Database insert error' });
        }

        const newCandidate = {
            id: result.insertId,
            name,
            email,
            phone,
            position,
            application_date: new Date().toISOString().split('T')[0],
            status: 'Pending',
        };

        res.status(201).json({
            message: 'Candidate added successfully.',
            candidate: newCandidate,
        });
    });
});

// Update a candidate
app.put('/api/candidates/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, phone, position, status } = req.body;

    if (!name || !email || !phone || !position || !status) {
        return res.status(400).json({ error: 'All fields are required for updating.' });
    }

    const sql = `
        UPDATE candidates 
        SET name = ?, email = ?, phone = ?, position_applied = ?, status = ? 
        WHERE id = ?`;
    db.query(sql, [name, email, phone, position, status, id], (err) => {
        if (err) {
            console.error('Database update error:', err.message);
            return res.status(500).json({ error: 'Database update error' });
        }

        const updatedCandidate = { id, name, email, phone, position, status };

        res.json({
            message: 'Candidate updated successfully.',
            candidate: updatedCandidate,
        });
    });
});

// Delete a candidate
app.delete('/api/candidates/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM candidates WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Database delete error:', err.message);
            return res.status(500).json({ error: 'Database delete error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Candidate not found.' });
        }
        res.json({
            message: `Candidate with ID ${id} has been successfully deleted.`,
            deletedId: id,
        });
    });
});

// Login route
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    db.query('SELECT * FROM admins WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error('Database query error:', err.message);
            return res.status(500).json({ error: 'Database query error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        const admin = results[0];

        if (password !== admin.password) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        res.status(200).json({ message: 'Login successful', token: 'your-jwt-token' });
    });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
