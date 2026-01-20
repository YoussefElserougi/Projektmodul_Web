import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2, Bot, ArrowLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { RoutePaths } from "../enum";
import { issueService } from "@/services/issueService";
import { useMutation } from "@tanstack/react-query";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

export const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      content:
        "Hello! I am the Graf-Syteco AI-Assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const {
    mutateAsync: getAIMessage,
    data: aiResponse,
    isPending: isGenerating,
    error,
  } = useMutation({
    mutationFn: (promptText: string) => issueService.getAIMessage(promptText),
    onSuccess: (data) => {
      console.log("AI Response received:", data);
    },
    onError: (err) => {
      console.error("AI Generation failed:", err);
    },
  });

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const data = await getAIMessage(userMessage.content);

      const botResponseText =
        data.output || "The chatbot is currently unreachable.";

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: botResponseText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "bot",
        content: "Error: Could not reach n8n. Is the workflow running?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden py-12 px-4">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        <Card className="h-[700px] flex flex-col border-border shadow-2xl bg-card/95 backdrop-blur-sm">
          <CardHeader className="border-b border-border/50 flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="w-5 h-5 text-primary" />
              AI Support
            </CardTitle>
            <Button
              variant="outline"
              onClick={() => navigate(RoutePaths.TOOLS)}
              className="gap-2 border-border text-foreground hover:bg-secondary hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Tools
            </Button>
          </CardHeader>

          <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex w-full",
                      msg.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg p-3 text-sm",
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      )}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start w-full">
                    <div className="bg-secondary text-secondary-foreground rounded-lg p-3 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-xs">Loading...</span>
                    </div>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border/50 bg-background/50">
              <form
                onSubmit={handleSendMessage}
                className="flex w-full items-center gap-2"
              >
                <Input
                  placeholder="Ask a question..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || !inputValue.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};
