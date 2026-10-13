# Task Manager — Full-Stack Web Application

A full-stack task management application built with **React, TypeScript, Node.js, Express and SQLite**. The application allows users to create, view, complete, delete and filter tasks through a React interface connected to a REST-style API.

## Features

- **Create tasks** with title validation.
- **View tasks** saved in the SQLite database.
- **Complete tasks** by toggling their completion status.
- **Delete tasks** when they are no longer needed.
- **Filter tasks** by All, Active and Completed.
- **Track remaining tasks** with a live counter.
- **Persistent storage** using SQLite.
- **Error handling** for API failures and invalid input.
- **REST API integration** between the frontend and backend.

## Technologies Used

| Technology | Purpose |
|---|---|
| React 18 | Frontend user interface |
| TypeScript | Static typing and maintainable code |
| Vite 6 | Frontend development server and build tool |
| Node.js | Backend JavaScript runtime |
| Express.js | REST API and HTTP request handling |
| SQLite | Relational database for persistent task storage |
| better-sqlite3 | SQLite database access |
| npm | Package and dependency management |

## Project Structure

```text
task-manager-fullstack/
├── client/
│   ├── src/
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
├── server/
│   ├── src/
│   │   └── index.ts
│   └── package.json
├── package.json
└── README.md
```

## Prerequisites

- Node.js 20 or newer
- npm

## Installation and Setup

Clone the repository and enter the project directory:

```bash
git clone https://github.com/codebyasim/task-manager-fullstack.git
cd task-manager-fullstack
```

Install the root dependencies:

```bash
npm install
```

Install the frontend and backend dependencies:

```bash
npm run install:all
```

Start both development servers:

```bash
npm run dev
```

Open the application in your browser:

**Frontend:** http://localhost:5173

**Backend API:** http://localhost:3001

The SQLite database file, `tasks.db`, is created automatically when the backend starts if it does not already exist.

## API Endpoints

The backend exposes the following endpoints:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Retrieve all tasks |
| POST | `/api/tasks` | Create a new task |
| PATCH | `/api/tasks/:id` | Update a task's completion status |
| DELETE | `/api/tasks/:id` | Delete a task |

### Example: Create a Task

Request:

```http
POST /api/tasks
Content-Type: application/json
```

Request body:

```json
{
  "title": "Complete university assignment"
}
```

The API validates the title, saves the task to SQLite and returns the created task.

## Technical Concepts Demonstrated

- REST API development and HTTP methods
- CRUD (Create, Read, Update and Delete) operations
- React Hooks: `useState`, `useEffect` and `useMemo`
- TypeScript types and type safety
- Asynchronous programming using `async` and `await`
- SQL queries and relational database operations
- Input validation and error handling
- Frontend and backend integration

## Future Improvements

- Add task editing, priorities and due dates.
- Implement automated frontend and API tests.
- Add search and task categories.
- Introduce GitHub Actions for continuous integration.
- Add Docker support for deployment.

## Author

Developed as a full-stack software engineering project to practise modern web development, API integration and database management.