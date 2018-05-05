const mongoose = require('mongoose');

// Coin Schema
let coinSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    imgcoin: {
        type: String,
        required: true
    },
    tokens: {
        type: String,
        required: true
    },
    moneys: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: true
    },
    tools: {
        type: Array,
        required: true
    },
    enddate: {
        type: Number,
        required: true
    },
    views: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    tuts: {
        type: String,
        required: true
    },
    info: {
        type: String,
        required: true
    },
    linkbuttonfirt: {
        type: String,
        required: true
    },
    new: {
        type: String,
        required: true
    },
    closed: {
        type: String,
        required: true
    },
    timeadd: {
        type: Number,
        required: true
    },
    timenew: {
        type: Number,
        required: true
    }
});

// exports Schema
let Coin = module.exports = mongoose.model('Coin', coinSchema);