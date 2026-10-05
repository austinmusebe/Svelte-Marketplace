# SWE4070 Marketplace Project

This project is an online marketplace application created for the SWE4070 course. It shows web application development using Svelte and SvelteKit.

## Prerequisites

Before you start, ensure you have the following installed:

- Node.js (version 18 or higher)
- npm
- MongoDB (running locally or an accessible remote instance)

## Getting Started

Follow these steps to run the application locally:

1. Clone the repository:
   ```sh
   git clone https://github.com/austinmusebe/swe4070project.git
   cd swe4070project
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory. Add the following settings:
   ```env
   MONGODB_URI=mongodb://localhost:27017/4070Svelte
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin1234
   ```

4. Start the MongoDB service:
   Ensure your MongoDB instance is running before you start the web server.

5. Start the development server:
   ```sh
   npm run dev
   ```

6. Open the application:
   Navigate to `http://localhost:5173` in your web browser.

