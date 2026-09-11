# Library Book Issue & Return Management System

## 1. Project Overview

The Library Book Issue & Return Management System is a full-stack web application designed to help librarians manage books and borrowing activities.

The system allows a librarian to add, view, search, update, and delete books. It also supports issuing and returning books, maintaining transaction history, detecting overdue books, generating and scanning QR codes, and exporting transaction records as CSV.

The frontend communicates with a Node.js and Express.js backend through REST APIs. Book and transaction data are stored in MongoDB Atlas.

---

## 2. Features Implemented

### Book Management

- Add a new book
- View all books
- Search books by title or author
- Edit book details
- Delete books
- Maintain total number of copies
- Maintain currently available copies
- Use a unique Book ID for each book

### Book Issue

- Issue a book using its Book ID
- Store borrower name
- Automatically record issue date
- Automatically calculate a 7-day due date
- Decrease available copies after issuing
- Prevent issuing when no copies are available

### Book Return

- Return a book using its Book ID
- Find the currently active transaction
- Automatically record return date
- Change transaction status to Returned
- Increase available copies

### Dashboard

The dashboard displays:

- Total books
- Available books
- Issued books
- Overdue books

### Search

Books can be searched using:

- Book title
- Author name

### QR Code Features

- Generate a QR code for each book
- QR code contains the unique Book ID
- Scan a book QR code using the device camera
- Display the Book ID obtained from the scan

### Transaction History

The system stores and displays:

- Book title
- Book ID
- Borrower name
- Issue date
- Due date
- Return date
- Current status

### Overdue Detection

A transaction is considered overdue when:

- Its status is Issued
- Its due date has passed

Overdue books are displayed on the dashboard and marked in the transaction history.

### CSV Export

Transaction records can be exported as a CSV file containing:

- Book Title
- Book ID
- Issued To
- Issue Timestamp
- Return Timestamp
- Current Status

### Input Validation

The frontend checks required fields before sending requests.

Examples:

- Empty book fields are rejected
- Total copies must be greater than zero
- Book ID is required for issuing and returning
- Borrower name is required when issuing a book

---

## 3. Additional Features Added

In addition to the basic book issue and return functionality, the following features were implemented:

1. QR code generation
2. QR code scanning using the device camera
3. Dashboard statistics
4. Overdue book detection
5. Search by title and author
6. Edit and delete book functionality
7. CSV transaction export
8. Frontend input validation
9. User-friendly error messages
10. Clean and responsive frontend styling

---

## 4. Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript
- HTML5 QR Code library

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

### Development Tools

- Visual Studio Code
- Thunder Client
- Git
- GitHub

---

## 5. Project Architecture

The project follows a simple client-server architecture.

```text
                    FRONTEND
               HTML + CSS + JavaScript
                         |
                         | HTTP Requests
                         v
                    EXPRESS API
                         |
              +----------+----------+
              |                     |
              v                     v
        Book Routes          Transaction Routes
              |                     |
              +----------+----------+
                         |
                         v
                     MONGOOSE
                         |
                         v
                   MONGODB ATLAS
