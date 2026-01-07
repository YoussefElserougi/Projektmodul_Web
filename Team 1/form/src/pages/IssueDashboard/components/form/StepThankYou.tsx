import { CheckCircle } from "lucide-react";

export function StepThankYou() {
  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
      <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mb-6">
        <CheckCircle className="w-10 h-10 text-primary-foreground" />
      </div>

      <h2 className="text-3xl font-semibold text-foreground mb-4">
        Thank You!
      </h2>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        Your submission has been received successfully.
      </p>

      <a
        href="/form/tools"
        className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        Back to Tools
      </a>
    </div>
  );
}
