import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Splash from "./pages/Splash";
import Welcome from "./pages/Welcome";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CreateTeam from "./pages/auth/CreateTeam";
import { MobileShell } from "./components/MobileShell";
import Feed from "./pages/Feed";
import ChallengeDetail from "./pages/ChallengeDetail";
import MatchDetail from "./pages/MatchDetail";
import MatchFeedback from "./pages/MatchFeedback";
import CreateChallenge from "./pages/CreateChallenge";
import Games from "./pages/Games";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";

import EditProfile from "./pages/EditProfile";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner theme="dark" position="top-center"/>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/create-team" element={<CreateTeam />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/app" element={<MobileShell />}>
                <Route index element={<Feed />} />
                <Route path="challenge/:id" element={<ChallengeDetail />} />
                <Route path="match/:id" element={<MatchDetail />} />
                <Route path="match/:id/feedback" element={<MatchFeedback />} />
                <Route path="create" element={<CreateChallenge />} />
                <Route path="games" element={<Games />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="profile" element={<Profile />} />
                <Route path="profile/edit" element={<EditProfile />} />
              </Route>
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
