import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ChatProvider } from '@/contexts/ChatContext';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { LiveChat } from '@/app/components/LiveChat';
import LandingPage from '@/app/pages/LandingPage';
import LoginPage from '@/app/pages/LoginPage';
import SignupPage from '@/app/pages/SignupPage';
import ForgotPasswordPage from '@/app/pages/ForgotPasswordPage';
import TermsAndConditionsPage from '@/app/pages/TermsAndConditionsPage';
import ProfilePage from '@/app/pages/ProfilePage';
import EditProfilePage from '@/app/pages/EditProfilePage';
import ChangePasswordPage from '@/app/pages/ChangePasswordPage';
import MyCoursesPage from '@/app/pages/MyCoursesPage';
import UpgradePage from '@/app/pages/UpgradePage';
import NotificationsSettingsPage from '@/app/pages/NotificationsSettingsPage';
import PrivacySecurityPage from '@/app/pages/PrivacySecurityPage';
import SupportPage from '@/app/pages/SupportPage';
import OnboardingPage from '@/app/pages/OnboardingPage';
import DashboardPage from '@/app/pages/DashboardPage';
import CompanionBuilderPage from '@/app/pages/CompanionBuilderPage';
import LearningSessionPage from '@/app/pages/LearningSessionPage';
import MCQCheckpointPage from '@/app/pages/MCQCheckpointPage';
import MyJourneyPage from '@/app/pages/MyJourneyPage';
import AccountPage from '@/app/pages/AccountPage';

export default function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/terms" element={<TermsAndConditionsPage />} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/edit-profile" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
            <Route path="/change-password" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />
            <Route path="/my-courses" element={<ProtectedRoute><MyCoursesPage /></ProtectedRoute>} />
            <Route path="/upgrade" element={<ProtectedRoute><UpgradePage /></ProtectedRoute>} />
            <Route path="/notifications-settings" element={<ProtectedRoute><NotificationsSettingsPage /></ProtectedRoute>} />
            <Route path="/privacy-security" element={<ProtectedRoute><PrivacySecurityPage /></ProtectedRoute>} />
            <Route path="/support" element={<ProtectedRoute><SupportPage /></ProtectedRoute>} />
            <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
            <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/build-companion" element={<ProtectedRoute><CompanionBuilderPage /></ProtectedRoute>} />
            <Route path="/learn/:id" element={<ProtectedRoute><LearningSessionPage /></ProtectedRoute>} />
            <Route path="/mcq/:id" element={<ProtectedRoute><MCQCheckpointPage /></ProtectedRoute>} />
            <Route path="/journey" element={<ProtectedRoute><MyJourneyPage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          {/* Global Live Chat */}
          <LiveChat />
        </Router>
      </ChatProvider>
    </AuthProvider>
  );
}
