import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/navigation";
import Leaderboard from "@/pages/leaderboard";
import RecruiterDashboard from "@/pages/recruiter-dashboard";
import UploadResume from "@/pages/upload-resume";
import CandidateDashboard from "@/pages/candidate-dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Switch>
        <Route path="/" component={Leaderboard} />
        <Route path="/leaderboard" component={Leaderboard} />
        <Route path="/recruiter" component={RecruiterDashboard} />
        <Route path="/upload" component={UploadResume} />
        <Route path="/dashboard" component={CandidateDashboard} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
