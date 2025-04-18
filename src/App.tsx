
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { EstudosProvider } from "./contexts/EstudosContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import NovoTema from "./pages/NovoTema";
import Revisoes from "./pages/Revisoes";
import Auth from "./pages/Auth";
import Flashcards from "./pages/Flashcards";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <EstudosProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Auth />} />
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/novo-tema" 
                element={
                  <ProtectedRoute>
                    <NovoTema />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/revisoes" 
                element={
                  <ProtectedRoute>
                    <Revisoes />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/flashcards" 
                element={
                  <ProtectedRoute>
                    <Flashcards />
                  </ProtectedRoute>
                } 
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </EstudosProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
