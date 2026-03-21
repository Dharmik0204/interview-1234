# InterviewIQ - AI Mock Interview Platform

InterviewIQ is a full-stack AI-powered mock interview web application built with the MERN stack. It allows users to practice interviews for various job roles, record voice answers, and receive detailed AI-generated feedback and scoring.

## Features

- **User Authentication**: Secure JWT-based signup/login.
- **AI Question Generation**: Scenario-based interview questions tailored to specific job roles using OpenAI GPT.
- **Voice-to-Text Integration**: Speak your answers directly using the Web Speech API.
- **AI Performance Evaluation**: Detailed scoring (out of 10), highlights of strengths, and suggestions for improvement.
- **Interview History**: Track your progress and review past sessions.
- **Premium UI**: Modern, clean dashboard with glassmorphism and smooth animations.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Axios, Lucide React.
- **Backend**: Node.js, Express, MongoDB (Mongoose), OpenAI API.
- **Security**: JWT, bcryptjs, Helmet, CORS.

## Getting Started

### Prerequisites

- Node.js installed.
- MongoDB instance (local or Atlas).
- OpenAI API Key.

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd pro2
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` folder:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   OPENAI_API_KEY=your_openai_api_key
   NODE_ENV=development
   ```
   Start the backend:
   ```bash
   npm run dev (if nodemon is installed) or node index.js
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

## Development

- Frontend runs on `http://localhost:5173`
- Backend runs on `http://localhost:5000`

## Preview Images

Refer to the `images` folder (as shown in the task request) for UI expectations.

## License

MIT
