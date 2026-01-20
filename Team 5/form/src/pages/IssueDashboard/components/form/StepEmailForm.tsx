import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormData } from "@/types/form";
import { Loader2 } from "lucide-react";
import { issueService } from "@/services/issueService";
import { useQuery } from "@tanstack/react-query";

interface StepEmailFormProps {
  data: FormData;
  onChange: (field: keyof FormData, value: string) => void;
  errors: Record<string, string>;
}

export function StepEmailForm({ data, onChange, errors }: StepEmailFormProps) {
  const {
    data: defaults,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["emailDefaults", data.selectedOption, data.solution],
    queryFn: () =>
      issueService.getEmailDefaults(data.selectedOption, data.solution),
    enabled: !!data.selectedOption,
  });

  useEffect(() => {
    if (defaults) {
      onChange("clientEmail", defaults.clientEmail || "");
      onChange("subject", defaults.subject || "");
      onChange("content", defaults.emailContent || "");
    }
  }, [defaults, onChange]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading default values...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Write Response Email
        </h2>
        <p className="text-muted-foreground">Fill in the information below</p>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error.message}</p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="clientEmail">Client Email</Label>
        <Input
          id="clientEmail"
          type="email"
          placeholder="client@example.com"
          value={data.clientEmail}
          onChange={(e) => onChange("clientEmail", e.target.value)}
          className={errors.clientEmail ? "border-destructive" : ""}
        />
        {errors.clientEmail && (
          <p className="text-sm text-destructive">{errors.clientEmail}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          placeholder="Email subject"
          value={data.subject}
          onChange={(e) => onChange("subject", e.target.value)}
          className={errors.subject ? "border-destructive" : ""}
        />
        {errors.subject && (
          <p className="text-sm text-destructive">{errors.subject}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          placeholder="Write your message here..."
          value={data.content}
          onChange={(e) => onChange("content", e.target.value)}
          className={errors.content ? "border-destructive" : ""}
          rows={5}
        />
        {errors.content && (
          <p className="text-sm text-destructive">{errors.content}</p>
        )}
      </div>
    </div>
  );
}
