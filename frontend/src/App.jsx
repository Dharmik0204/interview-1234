import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import InterviewRoom from './pages/InterviewRoom';
import FeedbackPage from './pages/FeedbackPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import History from './pages/History';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/history" element={<History />} />
        <Route path="/interview/:id" element={<InterviewRoom />} />
        <Route path="/feedback/:id" element={<FeedbackPage />} />
      </Routes>
    </div>
  );
}

export default App;
