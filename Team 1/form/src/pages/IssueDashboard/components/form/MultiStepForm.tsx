import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StepSelectIssue } from "./StepSelectIssue";
import { StepInfo } from "./StepInfo";
import { StepEmailForm } from "./StepEmailForm";
import { StepThankYou } from "./StepThankYou";
import { FormData, FormStep } from "@/types/form";
import { ArrowLeft, ArrowRight, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AuthContext } from "@/context";
import { useNavigate } from "react-router-dom";
import { RoutePaths } from "@/pages/enum";
import { issueService } from "@/services/issueService";

const initialFormData: FormData = {
  selectedOption: "",
  infoText: "",
  solution: "",
  clientEmail: "",
  subject: "",
  content: "",
  aiSolution: "",
};

export function MultiStepForm() {
  const { email } = useContext(AuthContext);

  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 4;

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (step: FormStep): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.selectedOption)
          newErrors.selectedOption = "Please select an option";
        break;
      case 3:
        if (!formData.clientEmail.trim()) {
          newErrors.clientEmail = "Client email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail)) {
          newErrors.clientEmail = "Please enter a valid email";
        }
        if (!formData.subject.trim()) newErrors.subject = "Subject is required";
        if (!formData.content.trim()) newErrors.content = "Content is required";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5) as FormStep);
    }
  };

  const prevStep = () => {
    if (currentStep === 1) {
      navigate(RoutePaths.TOOLS);
      return;
    }

    setCurrentStep((prev) => Math.max(prev - 1, 1) as FormStep);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);

    try {
      await issueService.submitIssueResolution({
        issueId: formData.selectedOption,
        employeeName: email,
        employeeEmail: email,
        clientEmail: formData.clientEmail,
        subject: formData.subject,
        emailContent: formData.content,
        solution: formData.solution,
        aiSolution: formData.aiSolution,
      });

      console.log("Form submitted successfully");
      setCurrentStep(4);
      toast.success("Form submitted successfully!");
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepSelectIssue
            data={formData}
            onChange={updateFormData}
            errors={errors}
          />
        );
      case 2:
        return (
          <StepInfo
            issueId={Number(formData.selectedOption)}
            formData={formData}
            onChange={updateFormData}
          />
        );
      case 3:
        return (
          <StepEmailForm
            data={formData}
            onChange={updateFormData}
            errors={errors}
          />
        );
      case 4:
        return <StepThankYou />;
      default:
        return null;
    }
  };

  const isThankYouPage = currentStep === 4;

  return (
    <Card className="w-full max-w-2xl mx-auto p-8 bg-card border-border shadow-2xl relative z-10">
      {/* Header / Branding */}
      {!isThankYouPage && (
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
            Graf Syteco <span className="text-primary">Assistant</span>
            <Sparkles className="w-4 h-4 text-primary animate-pulse-soft" />
          </h1>

          {/* Progress Bar */}
          <div className="flex items-center justify-center gap-2 mt-4 max-w-xs mx-auto">
            {Array.from({ length: totalSteps }).map((_, idx) => {
              const stepNum = idx + 1;
              const isActive = stepNum <= currentStep;
              return (
                <div
                  key={stepNum}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    isActive ? "bg-primary shadow-glow" : "bg-secondary"
                  }`}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="min-h-[400px] animate-fade-in text-foreground">
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      {!isThankYouPage && (
        <div className="flex justify-between mt-8 pt-6 border-t border-border/50">
          <Button
            variant="outline"
            onClick={prevStep}
            className="gap-2 border-border text-foreground hover:bg-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {currentStep === 1 ? "Back to Tools" : "Previous"}
          </Button>

          {currentStep < 3 ? (
            <Button
              onClick={nextStep}
              className="gap-2 bg-primary text-white hover:bg-primary/90 shadow-glow"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="gap-2 bg-primary text-white hover:bg-primary/90 shadow-glow"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
              <Send className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
