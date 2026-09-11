# 📚 Library Book Issue & Return Management System

A simple full-stack web application for managing library books, issuing and returning books, tracking transactions, generating QR codes, and exporting transaction records.

## 📌 Project Overview

The Library Book Issue & Return Management System helps a librarian manage books and borrowing activities through a simple web interface.

The system stores book and transaction data in MongoDB and uses a Node.js + Express backend to provide APIs to the frontend.

## ✨ Features

- 📊 Dashboard with library statistics
- ➕ Add new books
- 📚 View all books
- 🔍 Search books by title or author
- ✏️ Edit book details
- 🗑️ Delete books
- 📕 Issue books
- ↩️ Return books
- 📋 View transaction history
- ⚠️ Detect overdue books
- 📱 Generate QR codes for books
- 📷 Scan book QR codes
- 📥 Export transaction history as CSV
- ✅ Basic input validation

## 🛠️ Technologies Used

### Frontend
- HTML
- CSS
- JavaScript
- HTML5 QR Code

### Backend
- Node.js
- Express.js
- Mongoose
- CORS
- dotenv
- QRCode
- json2csv

### Database
- MongoDB Atlas

## 📁 Project Structure

```text
library-management
│
├── backend
│   ├── models
│   │   ├── Book.js
│   │   └── Transaction.js
│   │
│   ├── routes
│   │   ├── bookRoutes.js
│   │   └── transactionRoutes.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend
│   ├── index.html
│   ├── script.js
│   └── style.css
│
└── .gitignore