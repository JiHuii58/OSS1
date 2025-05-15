import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout.js";
import LoginPage from "./pages/LoginPage.js";
import RegisterPage from "./pages/RegisterPage.js";
import ForgotPassword from "./pages/ForgotPassword.js";
import ResetPassword from "./pages/ResetPassword.js";
import VerifyPage from "./pages/VerifyPage.js"; // ✅ import thêm VerifyPage
import Vocabulary from "./pages/Vocabulary.js";
import Profile from "./pages/Profile.js";
import Lessons from "./pages/Lessons.js";
import ListeningSpeaking from "./pages/ListeningSpeaking.js";
import TestQuiz from "./pages/TestQuizz.js";
import LearningHistory from "./pages/LearningHistory.js";
import DashboardWelcome from "./pages/DashboardWelcome.js";
import LessonDetail from "./pages/LessonDetail.js";
import ProtectedRoute from "./components/ProtectedRoute.js";

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify" element={<VerifyPage />} /> {/* ✅ Thêm route xác minh */}

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute element={<DashboardLayout><DashboardWelcome /></DashboardLayout>} />
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute element={<DashboardLayout><Profile /></DashboardLayout>} />
        }
      />
      <Route
        path="/vocabulary"
        element={
          <ProtectedRoute element={<DashboardLayout><Vocabulary /></DashboardLayout>} />
        }
      />
      <Route
        path="/lessons"
        element={
          <ProtectedRoute element={<DashboardLayout><Lessons /></DashboardLayout>} />
        }
      />
      <Route
        path="/listening_speaking"
        element={
          <ProtectedRoute element={<DashboardLayout><ListeningSpeaking /></DashboardLayout>} />
        }
      />
      <Route
        path="/test_quizz"
        element={
          <ProtectedRoute element={<DashboardLayout><TestQuiz /></DashboardLayout>} />
        }
      />
      <Route
        path="/learninghistory"
        element={
          <ProtectedRoute element={<DashboardLayout><LearningHistory /></DashboardLayout>} />
        }
      />
      <Route
        path="/lesson/:id"
        element={
          <ProtectedRoute element={<DashboardLayout><LessonDetail /></DashboardLayout>} />
        }
      />
    </Routes>
  );
}

export default AppRoutes;
