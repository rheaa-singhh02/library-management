const express = require("express");
const Book = require("../models/Book");
const Transaction = require("../models/Transaction");
const { Parser } = require("json2csv");

const router = express.Router();

router.post("/issue", async (req, res) => {
    try {
        const { bookId, borrowerName } = req.body;

        const book = await Book.findOne({ bookId });

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        if (book.availableCopies <= 0) {
            return res.status(400).json({
                message: "Book is not available"
            });
        }

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7);

        const transaction = new Transaction({
            bookId: book.bookId,
            bookTitle: book.title,
            borrowerName: borrowerName,
            dueDate: dueDate
        });

        await transaction.save();

        book.availableCopies -= 1;
        await book.save();

        res.status(201).json({
            message: "Book issued successfully",
            transaction
        });

    } catch (error) {
        res.status(500).json({
            message: "Error issuing book",
            error: error.message
        });
    }
});

router.post("/return", async (req, res) => {
    try {
        const { bookId } = req.body;

        const transaction = await Transaction.findOne({
            bookId: bookId,
            status: "Issued"
        });

        if (!transaction) {
            return res.status(400).json({
                message: "Book is not currently issued"
            });
        }

        const book = await Book.findOne({ bookId: bookId });

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        transaction.returnDate = new Date();
        transaction.status = "Returned";

        await transaction.save();

        book.availableCopies += 1;
        await book.save();

        res.json({
            message: "Book returned successfully",
            transaction
        });

    } catch (error) {
        res.status(500).json({
            message: "Error returning book",
            error: error.message
        });
    }
});

router.get("/", async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({
            issueDate: -1
        });

        res.json(transactions);

    } catch (error) {
        res.status(500).json({
            message: "Error getting transactions",
            error: error.message
        });
    }
});

router.get("/dashboard", async (req, res) => {
    try {
        const books = await Book.find();
        const transactions = await Transaction.find();

        const totalBooks = books.reduce(
            (total, book) => total + book.totalCopies,
            0
        );

        const availableBooks = books.reduce(
            (total, book) => total + book.availableCopies,
            0
        );

        const issuedBooks = totalBooks - availableBooks;

        const today = new Date();

        const overdueBooks = transactions.filter(transaction =>
            transaction.status === "Issued" &&
            transaction.dueDate < today
        ).length;

        res.json({
            totalBooks,
            availableBooks,
            issuedBooks,
            overdueBooks
        });

    } catch (error) {
        res.status(500).json({
            message: "Error getting dashboard statistics",
            error: error.message
        });
    }
});

router.get("/export", async (req, res) => {
    try {
        const transactions = await Transaction.find();

        const data = transactions.map(transaction => ({
            "Book Title": transaction.bookTitle,
            "Book ID": transaction.bookId,
            "Issued To": transaction.borrowerName,
            "Issue Timestamp": transaction.issueDate,
            "Return Timestamp": transaction.returnDate || "",
            "Current Status": transaction.status
        }));

        const parser = new Parser();
        const csv = parser.parse(data);

        res.header("Content-Type", "text/csv");
        res.attachment("library-transactions.csv");
        res.send(csv);

    } catch (error) {
        res.status(500).json({
            message: "Error exporting transactions",
            error: error.message
        });
    }
});

module.exports = router;