const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = "your_secret_key";

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Fetch user from database
  try {
    const [users] = await db.execute("SELECT * FROM admins WHERE username = ?", [username]);
    const user = users[0];

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ id: user.id, username: user.username }, secret, { expiresIn: '1h' });
      res.status(200).json({ token });
    } else {
      res.status(401).json({ error: "Invalid credentials." });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed." });
  }
});
