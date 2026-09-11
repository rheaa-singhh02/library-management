async function showDashboard() {

    const content = document.getElementById("content");

    content.innerHTML = "<h2>Loading dashboard...</h2>";

    try {

        const response = await fetch(
            "http://localhost:5000/api/transactions/dashboard"
        );

        const data = await response.json();

        content.innerHTML = `
    <h2>Dashboard</h2>

    <div class="dashboard">

        <div class="card">
            <h3>Total Books</h3>
            <p>${data.totalBooks}</p>
        </div>

        <div class="card">
            <h3>Available Books</h3>
            <p>${data.availableBooks}</p>
        </div>

        <div class="card">
            <h3>Issued Books</h3>
            <p>${data.issuedBooks}</p>
        </div>

        <div class="card">
            <h3>Overdue Books</h3>
            <p>${data.overdueBooks}</p>
        </div>

    </div>
`;

    } catch (error) {

        content.innerHTML =
            "<p>Unable to connect to server.</p>";
    }
}

function showAddBook() {

    document.getElementById("content").innerHTML = `
        <h2>Add Book</h2>

        <input type="text" id="title" placeholder="Book Title">
        <br><br>

        <input type="text" id="author" placeholder="Author">
        <br><br>

        <input type="text" id="bookId" placeholder="Book ID">
        <br><br>

        <input type="text" id="category" placeholder="Category">
        <br><br>

        <input type="number" id="totalCopies" placeholder="Total Copies">
        <br><br>

        <button onclick="addBook()">Add Book</button>

        <p id="addMessage"></p>
    `;
}

async function addBook() {

    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const bookId = document.getElementById("bookId").value.trim();
    const category = document.getElementById("category").value.trim();
    const totalCopies = document.getElementById("totalCopies").value;

    const message = document.getElementById("addMessage");

    if (!title || !author || !bookId || !category || !totalCopies) {
        message.innerText = "Please fill all fields.";
        return;
    }

    if (Number(totalCopies) <= 0) {
        message.innerText = "Total copies must be greater than 0.";
        return;
    }

    try {

        const token = localStorage.getItem("token");

        const response = await fetch(
            "http://localhost:5000/api/books",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },

                body: JSON.stringify({
                    title,
                    author,
                    bookId,
                    category,
                    totalCopies: Number(totalCopies)
                })
            }
        );

        const data = await response.json();

        message.innerText = data.message;

    } catch (error) {

        message.innerText = "Unable to connect to server.";
    }
}

function showSearch() {

    document.getElementById("content").innerHTML = `
        <h2>Search Books</h2>

        <input type="text" id="searchText" placeholder="Enter book title or author">

        <button onclick="searchBooks()">Search</button>

        <div id="searchResults"></div>
    `;
}


async function searchBooks() {

    const searchText = document
        .getElementById("searchText")
        .value
        .toLowerCase();

    const results = document.getElementById("searchResults");

    try {

        const response = await fetch(
            "http://localhost:5000/api/books"
        );

        const books = await response.json();

        const filteredBooks = books.filter(book =>
            book.title.toLowerCase().includes(searchText) ||
            book.author.toLowerCase().includes(searchText)
        );

        if (filteredBooks.length === 0) {

            results.innerHTML = "<p>No books found.</p>";

            return;
        }

        let html = "";

        filteredBooks.forEach(book => {

            html += `
                <div>
                    <h3>${book.title}</h3>
                    <p>Author: ${book.author}</p>
                    <p>Book ID: ${book.bookId}</p>
                    <p>Available: ${book.availableCopies} / ${book.totalCopies}</p>
                    <hr>
                </div>
            `;

        });

        results.innerHTML = html;

    } catch (error) {

        results.innerHTML =
            "<p>Unable to connect to server.</p>";
    }
}

async function showBooks() {

    const content = document.getElementById("content");

    content.innerHTML = "<h2>Loading books...</h2>";

    try {
        const token = localStorage.getItem("token");

const response = await fetch(
    "http://localhost:5000/api/books",
    {
        headers: {
            "Authorization": "Bearer " + token
        }
    }
);

        const books = await response.json();

        let html = "<h2>Books</h2>";

        if (books.length === 0) {
            html += "<p>No books available.</p>";
        } else {

            books.forEach(book => {
                html += `
                    <div>
                        <h3>${book.title}</h3>
                        <p>Author: ${book.author}</p>
                        <p>Book ID: ${book.bookId}</p>
                        <p>Category: ${book.category}</p>
                        <p>Available: ${book.availableCopies} / ${book.totalCopies}</p>

<button onclick="showQR('${book._id}')">
    Show QR Code
</button>
<button onclick="showEditBook('${book._id}')">
    Edit Book
</button>
<button onclick="deleteBook('${book._id}')">
    Delete Book
</button>
<hr>
                
                    </div>
                `;
            });
        }

        content.innerHTML = html;

    } catch (error) {
        content.innerHTML = "<p>Unable to connect to the server.</p>";
    }
}

async function showEditBook(id) {

    try {

        const response = await fetch(
            `http://localhost:5000/api/books`
        );

        const books = await response.json();

        const book = books.find(book => book._id === id);

        if (!book) {
            document.getElementById("content").innerHTML =
                "<p>Book not found.</p>";
            return;
        }

        document.getElementById("content").innerHTML = `
            <h2>Edit Book</h2>

            <input type="text" id="editTitle"
                   value="${book.title}" placeholder="Book Title">
            <br><br>

            <input type="text" id="editAuthor"
                   value="${book.author}" placeholder="Author">
            <br><br>

            <input type="text" id="editBookId"
                   value="${book.bookId}" placeholder="Book ID">
            <br><br>

            <input type="text" id="editCategory"
                   value="${book.category}" placeholder="Category">
            <br><br>

            <input type="number" id="editTotalCopies"
                   value="${book.totalCopies}" placeholder="Total Copies">
            <br><br>

            <button onclick="updateBook('${book._id}')">
                Save Changes
            </button>

            <button onclick="showBooks()">
                Cancel
            </button>

            <p id="editMessage"></p>
        `;

    } catch (error) {

        document.getElementById("content").innerHTML =
            "<p>Unable to load book.</p>";
    }
}

async function updateBook(id) {

    const title = document.getElementById("editTitle").value;
    const author = document.getElementById("editAuthor").value;
    const bookId = document.getElementById("editBookId").value;
    const category = document.getElementById("editCategory").value;
    const totalCopies = document.getElementById("editTotalCopies").value;

    try {

        const response = await fetch(
            `http://localhost:5000/api/books/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    title: title,
                    author: author,
                    bookId: bookId,
                    category: category,
                    totalCopies: Number(totalCopies)
                })
            }
        );

        const data = await response.json();

        document.getElementById("editMessage").innerText =
            data.message;

    } catch (error) {

        document.getElementById("editMessage").innerText =
            "Unable to connect to server.";
    }
}

async function showQR(id) {

    try {

        const response = await fetch(
            `http://localhost:5000/api/books/${id}/qr`
        );

        const data = await response.json();

        document.getElementById("content").innerHTML = `
            <h2>Book QR Code</h2>

            <p>Book ID: ${data.bookId}</p>

            <img src="${data.qrCode}" width="200">

            <br><br>

            <button onclick="showBooks()">
                Back to Books
            </button>
        `;

    } catch (error) {

        document.getElementById("content").innerHTML =
            "<p>Unable to generate QR code.</p>";
    }
}

function showIssue() {

    document.getElementById("content").innerHTML = `
        <h2>Issue Book</h2>

        <input type="text" id="issueBookId" placeholder="Book ID">
        <br><br>

        <input type="text" id="borrowerName" placeholder="Borrower Name">
        <br><br>

        <button onclick="issueBook()">Issue Book</button>

        <p id="issueMessage"></p>
    `;
}


async function issueBook() {

    const bookId = document.getElementById("issueBookId").value.trim();
    const borrowerName = document.getElementById("borrowerName").value.trim();

    const message = document.getElementById("issueMessage");

    if (!bookId || !borrowerName) {

        message.innerText = "Enter Book ID and Borrower Name.";
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:5000/api/transactions/issue",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    bookId,
                    borrowerName
                })
            }
        );

        const data = await response.json();

        message.innerText = data.message;

    } catch (error) {

        message.innerText = "Unable to connect to server.";
    }
}

function showReturn() {

    document.getElementById("content").innerHTML = `
        <h2>Return Book</h2>

        <input type="text" id="returnBookId" placeholder="Book ID">
        <br><br>

        <button onclick="returnBook()">Return Book</button>

        <p id="returnMessage"></p>
    `;
}


async function returnBook() {

    const bookId = document.getElementById("returnBookId").value.trim();

    const message = document.getElementById("returnMessage");

    if (!bookId) {

        message.innerText = "Enter Book ID.";
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:5000/api/transactions/return",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    bookId
                })
            }
        );

        const data = await response.json();

        message.innerText = data.message;

    } catch (error) {

        message.innerText = "Unable to connect to server.";
    }
}

async function showTransactions() {

    const content = document.getElementById("content");

    content.innerHTML = "<h2>Loading transactions...</h2>";

    try {

        const response = await fetch(
            "http://localhost:5000/api/transactions"
        );

        const transactions = await response.json();

        let html = "<h2>Transaction History</h2>";

        if (transactions.length === 0) {

            html += "<p>No transactions found.</p>";

        } else {

            transactions.forEach(transaction => {

                html += `
                    <div>
                        <h3>${transaction.bookTitle}</h3>
                        <p>Book ID: ${transaction.bookId}</p>
                        <p>Borrower: ${transaction.borrowerName}</p>
                        <p>Status: ${transaction.status}</p>

${
    transaction.status === "Issued" &&
    new Date(transaction.dueDate) < new Date()
        ? "<p><strong>Overdue</strong></p>"
        : ""
}
                        <p>Issue Date: ${new Date(transaction.issueDate).toLocaleDateString()}</p>
                        <p>Due Date: ${new Date(transaction.dueDate).toLocaleDateString()}</p>
                        <hr>
                    </div>
                `;

            });
        }

        content.innerHTML = html;

    } catch (error) {

        content.innerHTML =
            "<p>Unable to connect to the server.</p>";
    }
}

function showScanner() {

    document.getElementById("content").innerHTML = `
        <h2>Scan Book QR Code</h2>

        <div id="reader" style="width: 300px; margin: auto;"></div>

        <p id="scanResult"></p>
    `;

    const scanner = new Html5QrcodeScanner(
        "reader",
        {
            fps: 10,
            qrbox: 250
        }
    );

    scanner.render(
        function(decodedText) {

            document.getElementById("scanResult").innerText =
                "Book ID: " + decodedText;

            scanner.clear();

        },
        function(error) {
            // Ignore scanning errors
        }
    );
}

async function deleteBook(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this book?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:5000/api/books/${id}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        alert(data.message);

        showBooks();

    } catch (error) {

        alert("Unable to connect to server.");
    }
}
function exportTransactions() {

    window.location.href =
        "http://localhost:5000/api/transactions/export";
}

async function login() {

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    const message = document.getElementById("loginMessage");

    if (!username || !password) {
        message.innerText = "Please enter username and password.";
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:5000/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username,
                    password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            message.innerText = data.message;
            return;
        }

        localStorage.setItem("token", data.token);

        window.location.href = "index.html";

    } catch (error) {

        message.innerText = "Unable to connect to server.";
    }
}