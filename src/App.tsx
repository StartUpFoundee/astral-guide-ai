
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import LandingPage from "./components/LandingPage";
import BirthDetails from "./pages/BirthDetails";
import EnterDetails from "./pages/EnterDetails";
import Categories from "./pages/Categories";
import CategoryDetails from "./pages/CategoryDetails";
import ChatBox from "./pages/ChatBox";
import History from "./pages/History";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialPath, setInitialPath] = useState('/');

  useEffect(() => {
    // Check if we have a last session to resume
    const lastAstrologer = localStorage.getItem('lastAstrologer');
    const lastCategory = localStorage.getItem('lastCategory');
    const hasUserDetails = localStorage.getItem('user-store');
    
    if (lastAstrologer && lastCategory && hasUserDetails) {
      // Resume last chat session
      setInitialPath(`/chat/${lastCategory}/${lastAstrologer}`);
    } else if (hasUserDetails) {
      // User has entered details, go to categories
      setInitialPath('/categories');
    }
    
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
    </div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/birth-details" element={<BirthDetails />} />
            <Route path="/enter-details" element={<EnterDetails />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/category/:id" element={<CategoryDetails />} />
            <Route path="/chat/:categoryId/:astrologerId" element={<ChatBox />} />
            <Route path="/history" element={<History />} />
            <Route path="*" element={
              initialPath !== '/' ? <Navigate to={initialPath} replace /> : <div>Not Found</div>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
