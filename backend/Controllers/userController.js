// controllers/userController.js
const User = require('../models/User');

// Fetch all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Fetch user balance
exports.getUserBalance = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ balance: user.balance });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user balance' });
  }
};

// Update user balance
exports.updateUserBalance = async (req, res) => {
  const { userId } = req.params;
  const { balance } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.balance = balance;
    await user.save();

    res.status(200).json({ message: 'User balance updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user balance' });
  }
};
