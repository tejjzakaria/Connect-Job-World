import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/admin/SignIn";
import Dashboard from "./pages/admin/Dashboard";
import Clients from "./pages/admin/Clients";
import ClientDetail from "./pages/admin/ClientDetail";
import AddClient from "./pages/admin/AddClient";
import EditClient from "./pages/admin/EditClient";
import Submissions from "./pages/admin/Submissions";
import SubmissionDocuments from "./pages/admin/SubmissionDocuments";
import Analytics from "./pages/admin/Analytics";
import Settings from "./pages/admin/Settings";
import Documentation from "./pages/admin/Documentation";
import DocumentUpload from "./pages/DocumentUpload";
import TrackApplication from "./pages/public/TrackApplication";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<SignIn />} />
            <Route path="/admin/login" element={<SignIn />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/clients"
              element={
                <ProtectedRoute>
                  <Clients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/clients/:clientId"
              element={
                <ProtectedRoute>
                  <ClientDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/clients/:clientId/edit"
              element={
                <ProtectedRoute>
                  <EditClient />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/clients/add"
              element={
                <ProtectedRoute>
                  <AddClient />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/submissions"
              element={
                <ProtectedRoute>
                  <Submissions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/submissions/:submissionId/documents"
              element={
                <ProtectedRoute>
                  <SubmissionDocuments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/documentation"
              element={
                <ProtectedRoute>
                  <Documentation />
                </ProtectedRoute>
              }
            />
            {/* Public routes */}
            <Route path="/upload/:token" element={<DocumentUpload />} />
            <Route path="/track" element={<TrackApplication />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <VercelAnalytics />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
