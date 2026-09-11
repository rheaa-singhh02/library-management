const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    bookId: {
        type: String,
        required: true
    },

    bookTitle: {
        type: String,
        required: true
    },

    borrowerName: {
        type: String,
        required: true
    },

    issueDate: {
        type: Date,
        default: Date.now
    },

    returnDate: {
        type: Date,
        default: null
    },

    dueDate: {
        type: Date,
        required: true
    },

    status: {
        type: String,
        default: "Issued"
    }
});

module.exports = mongoose.model("Transaction", transactionSchema);