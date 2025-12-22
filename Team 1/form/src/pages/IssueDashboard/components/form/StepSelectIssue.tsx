import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormData } from "@/types/form";
import { Loader2 } from "lucide-react";
import { issueService } from "@/services/issueService";
import { useQuery } from "@tanstack/react-query";

interface StepSelectIssueProps {
  data: FormData;
  onChange: (field: keyof FormData, value: string) => void;
  errors: Record<string, string>;
}

export function StepSelectIssue({
  data,
  onChange,
  errors,
}: StepSelectIssueProps) {
  const {
    data: options = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["openIssues"],
    queryFn: async () => {
      const responseJson = await issueService.getOpenIssues();
      return responseJson.data.map((user) => ({
        id: String(user.id),
        label: user.option,
      }));
    },
    retry: false,
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading options from server...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
        <p className="text-destructive mb-2">
          {error instanceof Error ? error.message : "An error occurred"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="text-primary hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Select an Option
        </h2>
        <p className="text-muted-foreground">
          Choose from the available options
        </p>
      </div>

      <div className="space-y-2">
        {options.length > 0 ? (
          <>
            <Label htmlFor="selectedOption">Option</Label>
            <Select
              value={data.selectedOption}
              onValueChange={(value) => onChange("selectedOption", value)}
            >
              <SelectTrigger
                className={errors.selectedOption ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        ) : (
          <p>No options available.</p>
        )}

        {errors.selectedOption && (
          <p className="text-sm text-destructive">{errors.selectedOption}</p>
        )}
      </div>
    </div>
  );
}
