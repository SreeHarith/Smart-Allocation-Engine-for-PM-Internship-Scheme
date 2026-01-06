import React, { useState, useEffect } from "react";
import { User, Notification, Admin, Company, Student } from "./types";
import NotificationToast from "./components/NotificationToast";
import { generatePersonalizedNotification } from "./services/aiService";
import HomePage from "./components/HomePage";
import SidebarLayout from "./components/layout/SidebarLayout";
import {
  ADMIN_DATA,
  COMPANY_DATA,
  STUDENT_DATA,
  INTERNSHIPS,
  NEW_INTERNSHIP_FOR_SIMULATION,
} from "./constants";
import { calculateMatchScore } from "./services/matchingService";

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

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
        const upcomingInternships = INTERNSHIPS.map((internship) => {
          const deadline = new Date(internship.deadline);
          const daysLeft = Math.ceil(
            (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          );
          return { internship, daysLeft };
        }).filter(({ daysLeft }) => daysLeft > 0 && daysLeft <= 7);

        if (upcomingInternships.length > 0) {
          const bestUpcomingMatch = upcomingInternships.reduce(
            (best, current) => {
              const bestScore = calculateMatchScore(student, best.internship);
              const currentScore = calculateMatchScore(
                student,
                current.internship
              );
              return currentScore > bestScore ? current : best;
            }
          );

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
        const matchScore = calculateMatchScore(student, newInternship);

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

  const handleLogin = (role: "STUDENT" | "COMPANY" | "ADMIN") => {
    switch (role) {
      case "STUDENT":
        setCurrentUser(STUDENT_DATA);
        break;
      case "COMPANY":
        setCurrentUser(COMPANY_DATA);
        break;
      case "ADMIN":
        setCurrentUser(ADMIN_DATA);
        break;
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {!currentUser ? (
        <HomePage onLogin={handleLogin} />
      ) : (
        <SidebarLayout
          user={currentUser}
          onLogout={handleLogout}
          addNotification={addNotification}
          notifications={notifications}
          markAllAsRead={markAllAsRead}
          clearNotifications={clearNotifications}
          onUpdateUser={handleUpdateUser}
        >
          {/* Main content is now handled within SidebarLayout based on user role */}
        </SidebarLayout>
      )}

      {/* Notification container */}
      <div className="fixed top-20 right-5 z-50 space-y-3">
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

export default App;
