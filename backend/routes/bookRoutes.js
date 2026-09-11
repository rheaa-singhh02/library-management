const express = require("express");
const Book = require("../models/Book");
const QRCode = require("qrcode");
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const {
            title,
            author,
            bookId,
            category,
            totalCopies
        } = req.body;

        const book = new Book({
            title,
            author,
            bookId,
            category,
            totalCopies,
            availableCopies: totalCopies
        });

        await book.save();

        res.status(201).json({
            message: "Book added successfully",
            book
        });

    } catch (error) {
        res.status(500).json({
            message: "Error adding book",
            error: error.message
        });
    }
});

router.get("/", async (req, res) => {
    try {
        const books = await Book.find();

        res.json(books);

    } catch (error) {
        res.status(500).json({
            message: "Error getting books",
            error: error.message
        });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.json({
            message: "Book updated successfully",
            book
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating book",
            error: error.message
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.json({
            message: "Book deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting book",
            error: error.message
        });
    }
});

router.get("/:id/qr", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        const qrCode = await QRCode.toDataURL(book.bookId);

        res.json({
            bookId: book.bookId,
            qrCode: qrCode
        });

    } catch (error) {
        res.status(500).json({
            message: "Error generating QR code",
            error: error.message
        });
    }
});

module.exports = router;