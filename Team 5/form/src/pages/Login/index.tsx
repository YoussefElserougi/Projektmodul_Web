import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Sparkles, Search, FolderOpen, ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "@/context";

export const Login = () => {
  const navigate = useNavigate();
  const { setEmail } = useContext(AuthContext);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!emailInput.trim() || !passwordInput.trim()) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    setEmail(emailInput);
    navigate("/form/tools");
  };

  const features = [
    { icon: Sparkles, text: "AI Chat & Assistance" },
    { icon: Search, text: "Intelligent search in service documents" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Ambient glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      <Card className="w-full max-w-md mx-4 p-8 bg-card border-border shadow-2xl relative z-10">
        {/* Product name with AI emphasis */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Graf Syteco <span className="text-primary">AI</span>
          </h1>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full shadow-glow" />
        </div>

        {/* Welcome section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            Welcome back
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Sign in to access all AI tools and service features.
          </p>
        </div>

        {/* Login Form */}
        <div className="space-y-4 mb-8">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
          <Button className="w-full" size="lg" onClick={handleLogin}>
            Sign In
          </Button>
        </div>

        {/* What to expect section */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            What to expect:
          </h3>
          <div className="space-y-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-center gap-3 group">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {feature.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security notice */}
        <div className="bg-secondary/50 border border-border rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">Security:</span>{" "}
                Your connection is secure and fully encrypted.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
