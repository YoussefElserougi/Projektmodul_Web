import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  FileText,
  Plus,
  Sparkles,
  LogOut,
  ClipboardList,
  BookOpenCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/context";
import { RoutePaths } from "../enum";

export const Tools = () => {
  const navigate = useNavigate();
  const { setEmail } = useContext(AuthContext);

  const options = [
    {
      id: "open-issue",
      title: "New Support Ticket",
      icon: Plus,
      description: "Form to create a new technical issue",
      path: RoutePaths.CREATE_ISSUE,
    },
    {
      id: "assistant",
      title: "Ticket Response Flow",
      icon: ClipboardList,
      description: "Solve tickets with AI assistance",
      path: RoutePaths.ISSUE_DASHBOARD,
    },
    {
      id: "all-issues",
      title: "Issue Dashboard",
      icon: FileText,
      description: "View and manage all technical issues",
      path: RoutePaths.ALL_ISSUES,
    },
    {
      id: "chat",
      title: "Knowledge Hub Chat",
      icon: MessageSquare,
      description: "AI-powered chat assistant",
      path: RoutePaths.CHAT,
    },
    {
      id: "evaluation",
      title: "AI Quality Evaluation",
      icon: BookOpenCheck,
      description: "Evaluate AI responses for quality assurance",
      path: RoutePaths.EVALUATION,
    },
  ];

  const handleOnClick = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    setEmail(null);
    navigate("/form");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Logout Button */}
      <div className="absolute top-4 right-4 z-20">
        <Button variant="ghost" onClick={handleLogout} className="gap-2">
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>

      {/* Ambient glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            Graf Syteco <span className="text-primary">Tools</span>
            <Sparkles className="w-6 h-6 text-primary animate-pulse-soft" />
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Select a tool below to interact with the AI assistant or manage
            technical service issues.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {options.map((option, index) => {
              const Icon = option.icon;
              return (
                <Card
                  key={option.id}
                  className="group relative overflow-hidden transition-all duration-300 cursor-pointer bg-card border border-border/30 hover:border-primary hover:shadow-glow hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleOnClick(option.path)}
                >
                  <CardContent className="p-8 flex flex-col items-center text-center justify-center min-h-[320px]">
                    {/* Icon Circle */}
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-secondary mb-6 group-hover:bg-primary/10 transition-colors duration-300">
                      <Icon className="w-10 h-10 text-foreground group-hover:text-primary transition-colors duration-300" />
                    </div>

                    {/* Text Content */}
                    <div className="space-y-3">
                      <h2 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {option.title}
                      </h2>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {option.description}
                      </p>
                    </div>

                    {/* Decorative bottom line */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};
