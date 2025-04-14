
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EstudosProvider } from "./contexts/EstudosContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import NovoTema from "./pages/NovoTema";
import Revisoes from "./pages/Revisoes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <EstudosProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/novo-tema" element={<NovoTema />} />
            <Route path="/revisoes" element={<Revisoes />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </EstudosProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
