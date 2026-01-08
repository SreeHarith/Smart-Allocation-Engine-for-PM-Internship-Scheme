import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { User, Notification, Admin, Company, Student, Internship } from "./types";
import NotificationToast from "./components/NotificationToast";
import { generatePersonalizedNotification } from "./services/aiService";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import Register from "./components/Register";
import SidebarLayout from "./components/layout/SidebarLayout";
import {
  ADMIN_DATA,
  COMPANY_DATA,
  STUDENT_DATA,
  NEW_INTERNSHIP_FOR_SIMULATION,
} from "./constants";
import { calculateMatchScore } from "./services/matchingService";
import { api } from "./services/api";

// Student Components
import InternshipRecommendations from './components/InternshipRecommendations';
import Profile from './components/Profile';
import Upskilling from './components/Upskilling';
import MentorChat from './components/MentorChat';
import Simulator from './components/Simulator';
import AIMockInterview from './components/AIMockInterview';
import CertificatesPage from './components/CertificatesPage';
import AppliedInternships from './components/AppliedInternships';

// Other Dashboard Placeholders (You might need to import specific components for Company/Admin later)
import CompanyDashboard from './components/CompanyDashboard';
import AdminDashboard from './components/AdminDashboard';
import CandidateDetailsPage from './components/CandidateDetailsPage';


const AppContent: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('pm_internship_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const navigate = useNavigate();

  // --- Persistence ---
  // (Removed unnecessary useEffect for hydration)

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('pm_internship_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('pm_internship_user');
    }
  }, [currentUser]);

  // --- Notification Management ---
  const addNotification = (
    notification: Omit<Notification, "id" | "userType" | "read">
  ) => {
    const newNotification: Notification = {
      id: Date.now() + Math.random(),
      userType:
        (currentUser?.role.toLowerCase() as "student" | "company" | "admin") ||
        "student",
      read: false,
      ...notification,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => (n.read ? n : { ...n, read: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // --- User Management ---
  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  // Welcome, deadline, and new match notifications on student login
  useEffect(() => {
    if (currentUser?.role === "STUDENT") {
      const student = currentUser as Student;

      // 1. Welcome notification
      const showWelcomeNotification = async () => {
        const welcomeMessage = await generatePersonalizedNotification(student, {
          type: "welcome",
        });
        addNotification({ message: welcomeMessage, type: "info" });
      };
      const welcomeTimer = setTimeout(showWelcomeNotification, 1500);

      // 2. Deadline reminder simulation
      const showDeadlineReminder = async () => {
        const today = new Date();
        let internships: Internship[] = [];
        try {
          internships = await api.getInternships();
        } catch (e) {
          console.error(e);
          return;
        }

        const upcomingInternships = internships.map((internship) => {
          const deadline = new Date(internship.deadline);
          const daysLeft = Math.ceil(
            (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          );
          return { internship, daysLeft };
        }).filter(({ daysLeft }) => daysLeft > 0 && daysLeft <= 7);

        if (upcomingInternships.length > 0) {

          let bestUpcomingMatch = upcomingInternships[0];
          let maxScore = -1;

          for (const item of upcomingInternships) {
            const score = await calculateMatchScore(student, item.internship);
            if (score > maxScore) {
              maxScore = score;
              bestUpcomingMatch = item;
            }
          }

          const reminderMessage = await generatePersonalizedNotification(
            student,
            {
              type: "deadline_reminder",
              internshipName: bestUpcomingMatch.internship.title,
              daysLeft: bestUpcomingMatch.daysLeft,
            }
          );
          addNotification({ message: reminderMessage, type: "warning" });
        }
      };
      const deadlineTimer = setTimeout(showDeadlineReminder, 5000);

      // 3. New internship match simulation
      const showNewMatchAlert = async () => {
        const newInternship = NEW_INTERNSHIP_FOR_SIMULATION;
        const matchScore = await calculateMatchScore(student, newInternship);

        if (matchScore > 70) {
          const message = await generatePersonalizedNotification(student, {
            type: "new_match",
            internshipName: newInternship.title,
            matchScore: matchScore,
          });
          addNotification({ message: message, type: "info" });
        }
      };
      const newMatchTimer = setTimeout(showNewMatchAlert, 10000);

      return () => {
        clearTimeout(welcomeTimer);
        clearTimeout(deadlineTimer);
        clearTimeout(newMatchTimer);
      };
    }
  }, [currentUser]);

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/');
  };

  // Redirect Logic
  useEffect(() => {
    if (currentUser && window.location.pathname === '/') {
      if (currentUser.role === 'STUDENT') navigate('/student/dashboard');
      else if (currentUser.role === 'COMPANY') navigate('/company/dashboard');
      else if (currentUser.role === 'ADMIN') navigate('/admin/dashboard');
    }
  }, [currentUser, navigate]);


  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={!currentUser ? <HomePage onLogin={() => navigate('/login')} /> : <Navigate to={
          currentUser.role === 'STUDENT' ? '/student/dashboard' :
            currentUser.role === 'COMPANY' ? '/company/dashboard' :
              '/admin/dashboard'
        } />} />
        <Route path="/login" element={<Login onLogin={handleUpdateUser} />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes - Student */}
        {currentUser?.role === 'STUDENT' && (
          <Route path="/student" element={
            <SidebarLayout
              user={currentUser}
              onLogout={handleLogout}
              addNotification={addNotification}
              notifications={notifications}
              markAllAsRead={markAllAsRead}
              clearNotifications={clearNotifications}
              onUpdateUser={handleUpdateUser}
            />
          }>
            <Route path="dashboard" element={<InternshipRecommendations student={currentUser as Student} addNotification={addNotification} />} />
            <Route path="profile" element={<Profile student={currentUser as Student} onUpdateStudent={handleUpdateUser as any} />} />
            <Route path="applications" element={<AppliedInternships student={currentUser as Student} addNotification={addNotification} />} />
            <Route path="upskilling" element={<Upskilling student={currentUser as Student} />} />
            <Route path="mentor" element={<MentorChat student={currentUser as Student} />} />
            <Route path="simulator" element={<Simulator student={currentUser as Student} addNotification={addNotification} />} />
            <Route path="interview" element={<AIMockInterview student={currentUser as Student} />} />
            <Route path="certificates" element={<CertificatesPage />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
        )}

        {/* Protected Routes - Company */}
        {currentUser?.role === 'COMPANY' && (
          <Route path="/company" element={
            <SidebarLayout
              user={currentUser}
              onLogout={handleLogout}
              addNotification={addNotification}
              notifications={notifications}
              markAllAsRead={markAllAsRead}
              clearNotifications={clearNotifications}
              onUpdateUser={handleUpdateUser}
            />
          }>
            <Route path="dashboard" element={<CompanyDashboard activeView="dashboard" company={currentUser as Company} />} />
            <Route path="post" element={<CompanyDashboard activeView="post" company={currentUser as Company} />} />
            <Route path="candidate/:id" element={<CandidateDetailsPage />} />
            <Route index element={<Navigate to="dashboard" replace />} />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>
        )}
        {/* Protected Routes - Admin */}
        {currentUser?.role === 'ADMIN' && (
          <Route path="/admin" element={
            <SidebarLayout
              user={currentUser}
              onLogout={handleLogout}
              addNotification={addNotification}
              notifications={notifications}
              markAllAsRead={markAllAsRead}
              clearNotifications={clearNotifications}
              onUpdateUser={handleUpdateUser}
            />
          }>
            <Route path="dashboard" element={<AdminDashboard admin={currentUser as Admin} activeView="dashboard" />} />
            <Route path="users" element={<AdminDashboard admin={currentUser as Admin} activeView="users" />} />
            <Route path="analytics" element={<AdminDashboard admin={currentUser as Admin} activeView="analytics" />} />
            <Route index element={<Navigate to="dashboard" replace />} />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>
        )}

        {/* Catch all - 404 potentially, or redirect to Login */}
        <Route path="*" element={currentUser ? <Navigate to="/" /> : <Navigate to="/login" />} />

      </Routes>

      {/* Notification container - Global */}
      <div className="fixed top-24 right-5 z-50 space-y-4 w-full max-w-[350px] pointer-events-none">
        {notifications
          .filter((n) => !n.read)
          .slice(0, 3)
          .map((notification) => (
            <NotificationToast
              key={notification.id}
              notification={notification}
              onClose={() => markNotificationAsRead(notification.id)}
            />
          ))}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
