import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { validateConfig, logConfig } from "../config/app.config";
import Index from "./pages/Index";
import CTO from "./pages/CTO";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Validate and log configuration on app startup
    const validation = validateConfig();
    
    if (!validation.isValid) {
      console.error('❌ Configuration validation failed:', validation.errors);
      // You could show a toast or modal here if needed
    } else {
      console.log('✅ Configuration validation passed');
    }
    
    // Log configuration in development mode
    logConfig();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/cto" element={<CTO />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
