Simple Post App
Simple Post App is a web application built with Next.js that allows users to create, view, and manage posts. It uses MongoDB for data storage and Playwright for end-to-end testing.

Features
Create Posts: Users can create new posts with a title and content.
View Posts: All posts are displayed in a list, with the ability to view individual post details.
Edit Posts: Users can edit existing posts.
Delete Posts: Users can delete posts they no longer want to keep.
Technologies Used
Next.js: A React framework for server-side rendering and generating static websites.
MongoDB: A NoSQL database for storing post data.
Playwright: A testing framework for end-to-end testing of the application.
Getting Started
Prerequisites
Node.js (version 14 or above)
npm (version 6 or above)
MongoDB instance (local or cloud)
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/yourusername/simple-post-app.git
cd simple-post-app
Install dependencies:

bash
Copy code
npm install
Set up environment variables:

Create a .env.local file in the root directory and add the following:

env
Copy code
MONGODB_URI=your_mongodb_connection_string
Run the development server:

bash
Copy code
npm run dev
Open http://localhost:3000 to view the application.

Testing
This application uses Playwright for end-to-end testing.

Running Tests
Install Playwright:

bash
Copy code
npx playwright install
Run tests:

bash
Copy code
npx playwright test
This will execute all tests located in the tests directory.
