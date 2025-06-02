# MERN PDF Emailer System

A full-stack MERN (MongoDB, Express.js, React, Node.js) application designed to capture user input from a web form, dynamically generate a PDF document from this data in memory, and email the PDF as an attachment to the user. It also includes optional logging of submission details to a MongoDB database.

This system is ideal for scenarios requiring automated document generation and delivery based on user input, such as confirmation slips, personalized certificates, or simple reports.

## Features

*   **User-Friendly Web Form:** A React-based frontend for easy data submission.
*   **Backend Data Handling:** Robust Express.js API for processing form data.
*   **Input Validation & Sanitization:** Ensures data integrity and security using `express-validator`.
*   **Dynamic PDF Generation:** Uses Puppeteer to render HTML templates into PDF documents in memory (no file system storage on the server for the PDF itself).
*   **Automated Email Delivery:** Leverages Nodemailer to send personalized emails with the generated PDF as an attachment.
*   **Database Logging (Optional):** Stores submission details in MongoDB for record-keeping.
*   **Environment-Based Configuration:** Uses `.env` files for easy setup of credentials and settings.
*   **ESM Backend:** Modern JavaScript module system for the Node.js backend.

## Technologies Used

*   **Frontend:**
    *   React
    *   Axios (for API calls)
*   **Backend:**
    *   Node.js
    *   Express.js
    *   Puppeteer (for PDF generation)
    *   Nodemailer (for sending emails)
    *   Mongoose (ODM for MongoDB)
    *   `express-validator` (for validation and sanitization)
    *   `dotenv` (for environment variables)
*   **Database:**
    *   MongoDB
*   **Development & Testing:**
    *   Mailtrap.io (for SMTP testing during development)
    *   Nodemon (for auto-restarting the backend server)

## Prerequisites

Before you begin, ensure you have met the following requirements:

*   Node.js (v16.x or later recommended for ESM)
*   npm or yarn
*   MongoDB instance (local or cloud-based like MongoDB Atlas)
*   A Mailtrap.io account (or any other SMTP service credentials for testing/production)

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yashraj2310/mern-pdf-emailer
    cd mern-pdf-emailer
    ```

2.  **Backend Setup (`server/`):**
    *   Navigate to the server directory:
        ```bash
        cd server
        ```
    *   Install dependencies:
        ```bash
        npm install
        ```
    *   Create a `.env` file in the `server/` directory by copying the example (if you create one) or creating it manually.
        ```bash
        # cp .env.example .env # If you have an example file
        # Otherwise, create server/.env manually
        ```
    *   Populate `server/.env` with your credentials (see **Environment Configuration** below).

3.  **Frontend Setup (`client/`):**
    *   Navigate to the client directory from the project root:
        ```bash
        cd ../client
        # Or from server/: cd ../../client
        ```
    *   Install dependencies:
        ```bash
        npm install
        ```

## Environment Configuration

Create a `.env` file in the `server/` directory with the following variables. **Do not commit your `.env` file to version control.**

```env
# Server Configuration
PORT=5001

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/pdf_submissions # Or your MongoDB Atlas URI

# Email (Mailtrap or your SMTP provider) Credentials
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=your_mailtrap_inbox_username
MAIL_PASS=your_mailtrap_inbox_password
MAIL_FROM_ADDRESS="no-reply@yourdomain.com"
MAIL_FROM_NAME="Your System Name"
