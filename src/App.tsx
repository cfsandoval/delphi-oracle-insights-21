
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Experts from "./pages/Experts";
import RegistrationPending from "./pages/RegistrationPending";
import NotFound from "./pages/NotFound";
import StudyPreview from "./pages/StudyPreview";
import StudyParticipation from "./pages/StudyParticipation";
import StudyCompleted from "./pages/StudyCompleted";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/registration-pending" element={<RegistrationPending />} />
              <Route path="/experts" element={<Experts />} />
              <Route path="/study/:studyId/preview" element={<StudyPreview />} />
              <Route path="/study/:studyId/participate" element={<StudyParticipation />} />
              <Route path="/study-completed" element={<StudyCompleted />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
