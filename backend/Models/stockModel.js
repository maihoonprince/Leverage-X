// models/stockModel.js
const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    name: { type: String, required: true },
    currentPrice: { type: Number, required: true },
    fluctuationRange: { A: { type: Number }, B: { type: Number } }
});

module.exports = mongoose.model('Stock', stockSchema);