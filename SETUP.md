# Project Setup Guide for VS Code

This guide will walk you through setting up and running this project locally using Visual Studio Code. The project is a full-stack application with a Next.js frontend and a NestJS backend.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- A running [PostgreSQL](https://www.postgresql.org/download/) database instance.

## Recommended VS Code Extensions

For an optimal development experience, we recommend installing the following VS Code extensions:

- [**ESLint**](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint): Integrates ESLint into VS Code.
- [**Prettier - Code formatter**](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode): For consistent code formatting.
- [**Prisma**](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma): Adds syntax highlighting, formatting, and autocompletion for Prisma schemas.
- [**DotENV**](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv): Provides syntax highlighting for `.env` files.

## Step-by-Step Setup

### 1. Backend Setup (`/backend`)

The backend is a NestJS application.

1.  **Open a new terminal** in VS Code (`Terminal` > `New Terminal`).
2.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Set up environment variables:**
    Create a new file named `.env` in the `backend` directory. This file will store your secret keys and environment-specific settings. Copy the following content into it:

    ```env
    # PostgreSQL connection string
    # Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
    DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"

    # Port for the backend server
    PORT=3000

    # API Key for Google Gemini
    GEMINI_API_KEY="your-gemini-api-key"

    # Razorpay API Keys
    RAZORPAY_KEY_ID="your-razorpay-key-id"
    RAZORPAY_KEY_SECRET="your-razorpay-key-secret"

    # Secret for signing JSON Web Tokens (JWTs)
    JWT_SECRET="a-very-strong-and-secret-key"
    ```
    **Important:** Replace the placeholder values (like `your-gemini-api-key`) with your actual credentials. Make sure the `DATABASE_URL` points to your running PostgreSQL instance.

5.  **Run Database Migration:**
    This command reads your `prisma/schema.prisma` file and creates the corresponding tables in your database.
    ```bash
    npx prisma migrate dev --name init
    ```
6.  **(Optional) Seed the Database:**
    If you want to populate your database with initial data, run the seed script:
    ```bash
    npm run seed
    ```

7.  **Start the Backend Server:**
    ```bash
    npm run start:dev
    ```
    The backend server will start in watch mode, typically on `http://localhost:3000`. Keep this terminal running.

### 2. Frontend Setup (Root `/`)

The frontend is a Next.js application located in the project's root directory.

1.  **Open another terminal** in VS Code.
2.  **Install dependencies** in the root directory:
    ```bash
    npm install
    ```
3.  **Start the Frontend Development Server:**
    ```bash
    npm run dev
    ```
    The frontend will start, typically on `http://localhost:9002`. Open this URL in your browser to see the application. Keep this terminal running.

## Running the Application

To run the full application, you need both the **backend** and **frontend** servers running at the same time. Use two separate terminals in VS Code for this.

-   **Terminal 1:** `cd backend && npm run start:dev`
-   **Terminal 2:** `npm run dev`

You have now successfully set up and launched the project.
