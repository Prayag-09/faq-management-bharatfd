# FAQ Management System 🌐

A **full-stack multilingual FAQ management system** built with **Node.js** (Express, JavaScript) for the backend and **React** for the frontend. This project provides an intuitive platform for managing frequently asked questions (FAQs) in multiple languages. The backend uses **MongoDB** for data storage, **Redis** for caching, and **Google Translate API** for automated translations.

---

## Table of Contents 📚

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Running with Docker](#running-with-docker)
- [Usage](#usage)
  - [API Endpoints](#api-endpoints)
  - [Admin Panel](#admin-panel)
- [Development](#development)
  - [Running Tests](#running-tests)
  - [Git Commit Messages](#git-commit-messages)
- [Contributing](#contributing)
- [Acknowledgments](#acknowledgments)

---

## Features ✨

- **Multilingual FAQ Management:** Automatically translate FAQ content using Google Translate API.
- **Backend (Node.js):** Built with Express and JavaScript for better scalability and maintainability.
- **Frontend (React):** React-based admin panel with Quill.js for WYSIWYG support.
- **Caching:** Uses Redis for caching translated text to reduce API calls and improve performance.
- **API Documentation:** Provides easy-to-use API endpoints to manage FAQs.
- **Docker Support:** Run the entire application stack with Docker and Docker Compose.

---

## Tech Stack 🛠️

- **Backend:**
  - Node.js (Express, JavaScript)
  - MongoDB (for data storage)
  - Redis (for caching)
  - Google Translate API (for automated translations)
- **Frontend:**
  - React (for Admin Panel)
  - Quill.js (for WYSIWYG support)
  - Tailwind CSS (for styling)
- **DevOps:**
  - Docker (for containerization)
  - Docker Compose (for managing multi-container applications)
  - GitHub Actions (for CI/CD automation)

---

## Installation 🚀

### Prerequisites

Ensure the following software is installed on your machine:

- [Node.js](https://nodejs.org/en/) (v16+ recommended)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- [MongoDB](https://www.mongodb.com/) or a MongoDB Atlas account
- [Redis](https://redis.io/) (for caching)
- [Google Cloud API Key](https://cloud.google.com/translate/docs/setup)

### Backend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Prayag-09/faq-management-bharatfd.git
   cd faq-management-bharatfd
   ```

2. Navigate to the server directory:

   ```bash
   cd server
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file with the following keys (replace with your own values):

   ```env
   MONGO=mongodb+srv://<your-db-credentials>
   TRANSLATE_API_KEY=your-google-translate-api-key
   PORT=3000
   REDIS_USERNAME=default
   REDIS_PASSWORD=<redis-password>
   REDIS_HOST=<redis-host>
   REDIS_PORT=<redis-port>
   ```

5. Run the server:

   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd ../app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the frontend:

   ```bash
   npm run dev
   ```

### Running with Docker

To run the entire application stack using Docker and Docker Compose, simply run:

```bash
docker compose up -d
```

This command will:

- Build the frontend and backend Docker images.
- Start the MongoDB and Redis services.
- Set up the application on ports 3000 (backend) and 5173 (frontend).

To shut down the containers:

```bash
docker compose down
```

---

## Usage 📖

### API Endpoints

Here are some of the key API endpoints for managing FAQs:

- **Fetch all FAQs (default language: English):**

  ```bash
  GET /api/faqs
  ```

- **Create a new FAQ:**
  ```bash
  POST /api/faqs
  ```

To fetch FAQs in different languages:

- **Fetch FAQs in English (default):**

  ```bash
  http://localhost:8000/api/faqs/
  ```

- **Fetch FAQs in Hindi:**

  ```bash
  http://localhost:8000/api/faqs/?lang=hi
  ```

- **Fetch FAQs in Bengali:**
  ```bash
  http://localhost:8000/api/faqs/?lang=bn
  ```

### Admin Panel

The admin panel allows you to:

- View all FAQs
- Add, update, or archive FAQs
- Translate FAQ content to different languages
- Manage categories and languages

The admin panel is available at [http://localhost:5173](http://localhost:5173).

---

## Development 🛠️

### Running Tests

This project uses Mocha and Chai for testing. To run the tests, make sure you are in server directory and then execute the following command:

```bash
npm run test
```

### Git Commit Messages

We follow conventional commit messages to ensure clear and consistent versioning. Examples:

- `feat: Add multilingual FAQ model`
- `fix: Improve translation caching`
- `docs: Update README with API examples`

---

## Contributing 🤝

We welcome contributions! To contribute:

1. Fork the repository.
2. Create a new branch (e.g., `git checkout -b feature-branch`).
3. Commit your changes (`git commit -m "feat: Add new feature"`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a pull request.

---

## Acknowledgments 🙏

- **Google Translate API** for providing seamless translation capabilities.
- **MongoDB** and **Redis** for efficient data storage and caching.
- **React** and **Tailwind CSS** for building a modern and responsive admin panel.

---

Made with ❤️ by [Prayag Tushar](https://github.com/Prayag-09). Let's build something amazing together! 🚀
