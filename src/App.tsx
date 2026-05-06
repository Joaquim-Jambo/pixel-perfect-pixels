import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Welcome from "./pages/Welcome";
import NotFound from "./pages/NotFound";
import { MobileShell } from "./components/MobileShell";
import Feed from "./pages/Feed";
import ChallengeDetail from "./pages/ChallengeDetail";
import CreateChallenge from "./pages/CreateChallenge";
import Games from "./pages/Games";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => {
  // Force dark theme app-wide
  if (typeof document !== "undefined") document.documentElement.classList.add("dark");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner theme="dark" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/app" element={<MobileShell />}>
              <Route index element={<Feed />} />
              <Route path="challenge/:id" element={<ChallengeDetail />} />
              <Route path="create" element={<CreateChallenge />} />
              <Route path="games" element={<Games />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
