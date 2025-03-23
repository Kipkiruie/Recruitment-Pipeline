const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const user = await User.create({ name, email, password, role });
    res.status(201).json({ id: user._id, email: user.email, role: user.role });
  } catch (error) {
    res.status(400).json({ message: "User registration failed" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.comparePassword(password))) {
    res.json({
      token: generateToken(user._id),
      id: user._id,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

const getUserProfile = async (req, res) => {
  res.json(req.user);
};

module.exports = { registerUser, loginUser, getUserProfile };
