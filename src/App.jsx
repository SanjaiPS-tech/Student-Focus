import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';
import Planner from './pages/Planner';
import StudyRooms from './pages/StudyRooms';
import FocusMode from './pages/FocusMode';
import AskAI from './pages/AskAI';
import Profile from './pages/Profile';
import Layout from './components/Layout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="notes" element={<Notes />} />
            <Route path="planner" element={<Planner />} />
            <Route path="rooms" element={<StudyRooms />} />
            <Route path="focus" element={<FocusMode />} />
            <Route path="ask-ai" element={<AskAI />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
