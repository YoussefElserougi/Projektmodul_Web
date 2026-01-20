import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context";
import {
  Login,
  IssueDashboard,
  NotFound,
  Tools,
  CreateIssue,
  AllIssues,
  Evaluation,
  Chat,
} from "@/pages";
import { RoutePaths } from "./pages/enum";

const queryClient = new QueryClient();

const pages = [
  {
    path: RoutePaths.LOGIN,
    element: <Login />,
  },
  {
    path: RoutePaths.ISSUE_DASHBOARD,
    element: <IssueDashboard />,
  },
  {
    path: RoutePaths.TOOLS,
    element: <Tools />,
  },
  {
    path: RoutePaths.CREATE_ISSUE,
    element: <CreateIssue />,
  },
  {
    path: RoutePaths.ALL_ISSUES,
    element: <AllIssues />,
  },
  {
    path: RoutePaths.CHAT,
    element: <Chat />,
  },
  {
    path: RoutePaths.EVALUATION,
    element: <Evaluation />,
  },
];

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {pages.map((page) => (
              <Route key={page.path} path={page.path} element={page.element} />
            ))}

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);
