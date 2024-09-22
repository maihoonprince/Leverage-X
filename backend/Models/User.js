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
        enum: ['Plan1', 'Plan2', 'Plan3'],
        default: null
    },
    stocks: [{
        stockName: String,
        buyPrice: Number,
        quantity: Number,
        sellPrice: Number,
    }]
});

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;
