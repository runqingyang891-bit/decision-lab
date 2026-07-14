import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAppStore } from "./stores/appStore";
import { GridBackground } from "./components/layout/GridBackground";
import { WelcomePage } from "./pages/WelcomePage";
import { HubPage } from "./pages/HubPage";
import { LightDecisionPage } from "./pages/LightDecisionPage";
import { DeepDecisionPage } from "./pages/DeepDecisionPage";
import { ArchivePage } from "./pages/ArchivePage";
import { ProfilePage } from "./pages/ProfilePage";
import { FloatingLabDecorations, LabFooterDecoration } from "./components/decorations/LabDecorations";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user_profile = useAppStore((state) => state.user_profile);
  if (!user_profile) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const user_profile = useAppStore((state) => state.user_profile);
  if (user_profile) {
    return <Navigate to="/hub" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <GridBackground>
      <FloatingLabDecorations />
      <LabFooterDecoration />
      <div className="relative z-10 min-h-screen pb-32">
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <PublicRoute>
                  <WelcomePage />
                </PublicRoute>
              }
            />
            <Route
              path="/hub"
              element={
                <ProtectedRoute>
                  <HubPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/light-decision"
              element={
                <ProtectedRoute>
                  <LightDecisionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/deep-decision"
              element={
                <ProtectedRoute>
                  <DeepDecisionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/archive"
              element={
                <ProtectedRoute>
                  <ArchivePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </div>
    </GridBackground>
  );
}
