import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScheduleProvider } from "@/context/ScheduleContext";
import { MainLayout } from "@/components/layout/MainLayout";
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import Instructors from "./pages/Instructors";
import Rooms from "./pages/Rooms";
import CreateSchedule from "./pages/CreateSchedule";
import Timetable from "./pages/Timetable";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ScheduleProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/instructors" element={<Instructors />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/schedule" element={<CreateSchedule />} />
              <Route path="/timetable" element={<Timetable />} />
              <Route path="/search" element={<Search />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </ScheduleProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
