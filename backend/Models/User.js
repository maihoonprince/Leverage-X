const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {  // Added email field
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    aadhaar: {
        type: String,
        required: true,
    },
    pan: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        default: 0
    },
    plan: {
        type: String,
        enum: ['Rapid', 'Evolution', 'Prime'],
        default: null
    },
    stocks: [{
        stockName: String,
        buyPrice: Number,
        quantity: Number,
        sellPrice: Number,
    }]
});

// Use the following to avoid the OverwriteModelError:
const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = UserModel;
