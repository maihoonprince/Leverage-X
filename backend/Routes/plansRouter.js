const express = require('express');
const router = express.Router();
const UserModel = require('../models/User');

// POST: Select and Pay for a Plan
// POST: Select and Pay for a Plan
router.post('/purchase', async (req, res) => {
    try {
        const { userId, plan } = req.body;

        // Find the user by ID
        const user = await UserModel.findById(userId);
        
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Check if user has already purchased the Rapid plan
        if (plan === 'Rapid' && user.hasBoughtRapidPlan) {
            return res.status(400).json({ msg: 'You have already purchased the Rapid plan and cannot buy it again!' });
        }

        // If the user buys the Rapid plan for the first time
        if (plan === 'Rapid') {
            user.hasBoughtRapidPlan = true;  // Set flag to true
            user.plan = plan;  // Store the plan
            await user.save();
        }

        res.status(200).json({ msg: 'Plan purchased successfully', hasBoughtRapidPlan: user.hasBoughtRapidPlan });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
});


// GET: Check if the user has already purchased a plan
router.get('/user-plan/:userId', async (req, res) => {
    try {
        // Find the user by ID
        const user = await UserModel.findById(req.params.userId);

        // Check if user exists
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.status(200).json({ plan: user.plan });
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
