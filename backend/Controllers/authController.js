const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../Models/userModel");

const signup = async (req, res) => {
    try {
        const { fullName, email, mobile, aadhaar, pan, password } = req.body;
        const user = await User.findOne({ email });  // Check if email already exists
        if (user) {
            return res.status(409)
                .json({ message: 'Email already exists, please login', success: false });
        }

        const newUser = new User({ fullName, email, mobile, aadhaar, pan, password });
        newUser.password = await bcrypt.hash(password, 10);
        await newUser.save();
        res.status(201)
            .json({
                message: "Signup successful",
                success: true
            });
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server error",
                success: false
            });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });  // Search by email
        const errorMsg = 'Auth failed, email or password is incorrect';
        if (!user) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }

        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }

        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },  // Include user ID in the token payload
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200)
            .json({
                message: "Login Success",
                success: true,
                jwtToken,
                userId: user._id,       // Return userId in the response
                email: user.email,      // Return email as well
                fullName: user.fullName // Include fullName in the response
            });
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server error",
                success: false
            });
    }
};

module.exports = {
    signup,
    login
};