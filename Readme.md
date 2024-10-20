# Daily Expense Sharing Application

This is the backend service for the **Daily Expense Sharing Application**. It allows users to add expenses and split them using three different methods: equal amounts, exact amounts, and percentages. Additionally, users can manage their expenses and generate downloadable balance sheets.

## Features

- **User Management:** Create and manage users with name, email, and mobile number.
- **Expense Management:** Add and split expenses using Equal, Exact, or Percentage methods.
- **Balance Sheet:** Retrieve and download the balance sheet for users.
- **Data Validation:** Ensures the integrity of the input data, such as percentage validation.
- **Authentication & Authorization:** JWT-based authentication for user security (bonus feature).
- **Error Handling:** Comprehensive error handling for all operations.

## Project Structure

```
server/
│
├── controllers/
│   ├── userController.js
│   └── expenseController.js
├── models/
│   ├── User.js
│   └── Expense.js
├── routes/
│   ├── userRoutes.js
│   └── expenseRoutes.js
├── app.js
├── server.js
├── .env
├── .env.test
└── package.json
```

## Prerequisites

- **Node.js** (version 14+)
- **MongoDB** (local or cloud instance like MongoDB Atlas)

## Setup Instructions

1. **Clone the repository:**

    ```bash
    git clone https://github.com/soumikroychowdhury/Expense_Sharing_App_20-10-2024-01.git
    ```

2. **Navigate to the `server` folder:**

    ```bash
    cd server
    ```

3. **Install dependencies:**

    Make sure you have all the required Node.js packages installed. Run:

    ```bash
    npm install
    ```

4. **Set up environment variables:**

    Create a `.env` file in the `server/` directory and add the following:

    ```
    MONGODB_URI=<your_mongo_db_uri>
    JWT_SECRET=<your_secret_key>
    PORT=<port_number>
    ```

    Replace `<your_mongo_db_uri>` with the URI of your MongoDB instance and `<your_secret_key>` with any secret string for JWT, and also add a PORT number for the server.

5. **Start the server:**

    Run the following command:

    ```bash
    npm run dev
    ```

    The backend will now be running at specified PORT.

## API Endpoints

### User Endpoints

#### 1. **Register User**

    - **Method:** `POST`
    - **URL:** `/api/users/register`
    - **Description:** Register a new user.
    - **Request Body:**

      ```json
      {
         "name": "John Doe",
         "email": "john@example.com",
         "mobileNumber": "1234567890",
         "password": "securepassword"
      }
      ```

    - **Response:** JSON object with user details and token.

#### 2. **Login User**

    - **Method:** `POST`
    - **URL:** `/api/users/login`
    - **Description:** Authenticate user and retrieve a token.
    - **Request Body:**

      ```json
      {
         "email": "john@example.com",
         "password": "securepassword"
      }
      ```

    - **Response:** JSON object with user details and token.

#### 3. **Get User Details**

    - **Method:** `GET`
    - **URL:** `/api/users/:id`
    - **Description:** Retrieve user details by user ID (requires token).
    - **Response:** JSON object with user details (excluding password).

### Expense Endpoints

#### 1. **Add Expense**

    - **Method:** `POST`
    - **URL:** `/api/expenses`
    - **Description:** Add a new expense.
    - **Request Body:**

      ```json
      {
         "description": "Dinner",
         "amount": 3000,
         "splitMethod": "equal", 
         "participants": [
            { "user": "user_id_1" },
            { "user": "user_id_2" },
            { "user": "user_id_3" }
         ]
      }
      ```

    - **Split Methods:**
      - **Equal:** Split equally among all participants.
      - **Exact:** Specify exact amounts for each participant.
      - **Percentage:** Specify the percentage of the total amount for each participant.
    
    - **Response:** JSON object with the newly added expense.

#### 2. **Get User Expenses**

    - **Method:** `GET`
    - **URL:** `/api/expenses/user/:userId`
    - **Description:** Retrieve expenses for a specific user.
    - **Response:** JSON array of expenses.

#### 3. **Get Overall Expenses**

    - **Method:** `GET`
    - **URL:** `/api/expenses/overall`
    - **Description:** Retrieve overall expenses across all users.
    - **Response:** JSON array of all expenses.

#### 4. **Download Balance Sheet**

    - **Method:** `GET`
    - **URL:** `/api/expenses/balance-sheet`
    - **Description:** Download a CSV balance sheet for all users.
    - **Response:** CSV file with user balances.

## Data Validation

- **Exact Split:** The total amount split must equal the total expense.
- **Percentage Split:** Percentages must sum up to 100%.


## Error Handling

Error handling is in place for all endpoints, with appropriate HTTP status codes and error messages returned. Common error cases include:

- Invalid input data
- Unauthorized access (JWT token not provided or invalid)
- Database errors (e.g., MongoDB connection failure)

## Features

- **User Authentication:** JWT-based authentication for secured endpoints.
- **Input Validation:** Strict validation on user data and expenses, ensuring percentages add up and amounts are correct.
- **Downloadable Balance Sheet:** The balance sheet is available for download in CSV format.
- **Test Cases:** Added tests to ensure the reliability of the application.

