// student-saathi-backend/models/Document.js

const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
    name: { type: String, required: true },
    url: { type: String, required: true }
});

const DocumentSchema = new mongoose.Schema({
    document_name: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    steps: {
        type: String, // Stored as one long string with '→' separator
        required: true
    },
    required_documents: {
        type: [String], // Array of strings
        default: []
    },
    eligibility: {
        type: String,
        default: 'Check Official Site'
    },
    application_fee: {
        type: String,
        default: 'Not Specified'
    },
    processing_time: {
        type: String,
        default: 'Varies'
    },
    official_links: {
        type: [LinkSchema],
        default: []
    },
    date_created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Document', DocumentSchema);