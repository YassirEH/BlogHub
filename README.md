# 📝 Blogger Website Using MERN

![MERN Stack](https://img.shields.io/badge/MERN-Stack-brightgreen)

Welcome to the **Blogger Website Using MERN** repository! This project is a full-stack application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). It provides a platform for users to create, read, update, and delete (CRUD) blog posts, complete with user authentication and image uploads.

For the latest releases, check out our [Releases section](https://github.com/SubhanAkhter/blogger_website_using_MERN/releases).

## 📚 Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Getting Started](#getting-started)
4. [Project Structure](#project-structure)
5. [API Endpoints](#api-endpoints)
6. [Frontend Components](#frontend-components)
7. [User Authentication](#user-authentication)
8. [Image Upload](#image-upload)
9. [Responsive Design](#responsive-design)
10. [Contributing](#contributing)
11. [License](#license)
12. [Acknowledgments](#acknowledgments)

## ✨ Features

- User authentication (registration and login)
- CRUD operations for blog posts
- Image upload using Multer
- Responsive UI for mobile and desktop
- Contact page for user inquiries

## 🛠️ Technologies Used

- **Frontend:** React.js, HTML, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Image Handling:** Multer
- **Environment Variables:** dotenv

## 🚀 Getting Started

To set up this project locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/SubhanAkhter/blogger_website_using_MERN.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd blogger_website_using_MERN
   ```

3. **Install dependencies:**

   For the backend:

   ```bash
   cd backend
   npm install
   ```

   For the frontend:

   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables:**

   Create a `.env` file in the backend directory and add the necessary environment variables. Refer to the `.env.example` for required fields.

5. **Run the application:**

   Start the backend server:

   ```bash
   cd backend
   npm start
   ```

   Start the frontend development server:

   ```bash
   cd ../frontend
   npm start
   ```

Your application should now be running on `http://localhost:3000`.

## 📂 Project Structure

```
blogger_website_using_MERN/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── .env.example
│   ├── server.js
│   └── package.json
└── frontend/
    ├── public/
    ├── src/
    ├── .env.example
    └── package.json
```

## 🔗 API Endpoints

### User Authentication

- **POST** `/api/auth/register`: Register a new user
- **POST** `/api/auth/login`: Log in an existing user

### Blog Operations

- **GET** `/api/blogs`: Retrieve all blogs
- **GET** `/api/blogs/:id`: Retrieve a specific blog by ID
- **POST** `/api/blogs`: Create a new blog
- **PUT** `/api/blogs/:id`: Update an existing blog
- **DELETE** `/api/blogs/:id`: Delete a blog

## 📦 Frontend Components

The frontend is built using React components. Here are some key components:

- **App.js**: Main application component
- **Header.js**: Navigation bar
- **BlogList.js**: Displays a list of blogs
- **BlogForm.js**: Form for creating and editing blogs
- **Login.js**: User login component
- **Register.js**: User registration component
- **Contact.js**: Contact page component

## 🔒 User Authentication

User authentication is handled through JWT (JSON Web Tokens). When a user registers or logs in, they receive a token that they can use to access protected routes. The backend verifies this token to ensure that the user is authenticated.

### Registration

To register, users must provide a username, email, and password. The server hashes the password before storing it in the database.

### Login

During login, users provide their credentials. If they match the records, the server generates a token for the user.

## 🖼️ Image Upload

This application uses Multer for handling image uploads. Users can upload images when creating or editing blog posts. The images are stored on the server, and their URLs are saved in the database.

## 📱 Responsive Design

The UI is designed to be responsive, ensuring a seamless experience on both mobile and desktop devices. CSS media queries are used to adjust styles based on the screen size.

## 🤝 Contributing

We welcome contributions to this project! If you want to help, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your branch to your fork.
5. Open a pull request.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to the MERN community for their support and resources.
- Special thanks to all contributors who make this project better.
