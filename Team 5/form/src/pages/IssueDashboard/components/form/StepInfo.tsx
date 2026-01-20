import { useState, useRef } from "react";
import { FormData, IssueDetails, ExtractedInfo } from "@/types/form";
import {
  Loader2,
  User,
  Mail,
  FileText,
  Building,
  Package,
  MessageSquare,
  Lightbulb,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import EmailHtmlRenderer from "../EmailHtmlRenderer";
import { useFetchIssue } from "../../hooks/useFetchIssue";
import { useFetchIssueAI } from "../../hooks/useFetchIssueAI";

interface StepInfoProps {
  formData: FormData;
  issueId: number;
  onChange: (field: keyof FormData, value: string) => void;
}

export function StepInfo({ formData, issueId, onChange }: StepInfoProps) {
  const { data, isLoading, isError } = useFetchIssue(issueId);

  const {
    data: dataAI,
    isLoading: isLoadingAI,
    isError: isErrorAI,
  } = useFetchIssueAI(issueId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading information...</p>
      </div>
    );
  }

  if (isError || isErrorAI || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
        <p className="text-destructive mb-2">
          Failed to load information. Please try again.
        </p>
        <button
          onClick={() => {
            window.location.reload();
          }}
          className="text-primary hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Issue Details */}
      <div className="p-6 rounded-lg bg-secondary/50 border border-border">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-primary" />
          <h2 className="font-semibold text-foreground text-xl">
            Issue Details
          </h2>
        </div>
        <div className="space-y-2">
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Name:</span>{" "}
            {data.name}
          </p>
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Email:</span>{" "}
            {data.email}
          </p>
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Subject:</span>{" "}
            {data.subject}
          </p>
        </div>
      </div>

      {/* Email Content */}
      <div className="p-6 rounded-lg bg-secondary/50 border border-border">
        <div className="flex items-center gap-3 mb-4">
          <Mail className="w-6 h-6 text-primary" />
          <h2 className="font-semibold text-foreground text-xl">
            Email Content
          </h2>
        </div>

        <EmailHtmlRenderer html={data.emailContent} />
      </div>

      {/* Extracted Information */}
      <div className="p-6 rounded-lg bg-secondary/50 border border-border">
        <div className="flex items-center gap-3 mb-4">
          <Building className="w-6 h-6 text-primary" />
          <h2 className="font-semibold text-foreground text-xl">
            Extracted Information
          </h2>
        </div>
        <div className="space-y-3">
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Company:</span>{" "}
            {data.company_name}
          </p>
          <div>
            <p className="font-medium text-foreground mb-2">Products:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
              {data.products.map((product, index) => (
                <li key={index}>{product}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {isLoadingAI ? (
        <>
          {/* Possible Solution */}
          <div className="p-6 rounded-lg bg-secondary/50 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-6 h-6 text-primary" />
              <h2 className="font-semibold text-foreground text-xl">
                Possible Solution
              </h2>
            </div>

            <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Analyzing with AI...</p>
            </div>
          </div>

          <div className="p-6 rounded-lg bg-secondary/50 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-6 h-6 text-primary" />
              <h2 className="font-semibold text-foreground text-xl">
                Reference Files
              </h2>
            </div>

            <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Analyzing with AI...</p>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Possible Solution */}
          <div className="p-6 rounded-lg bg-secondary/50 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-6 h-6 text-primary" />
              <h2 className="font-semibold text-foreground text-xl">
                Possible Solution
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {dataAI.possibleSolution}
            </p>
          </div>

          <div className="p-6 rounded-lg bg-secondary/50 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-6 h-6 text-primary" />
              <h2 className="font-semibold text-foreground text-xl">
                Reference Files
              </h2>
            </div>
            <div className="space-y-2">
              {dataAI.files.length === 0 && (
                <p className="text-muted-foreground">
                  No reference files provided.
                </p>
              )}
              {dataAI.files.map((file, index) => (
                <div key={index}>
                  <a
                    href={file.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {file.name}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Solution Input */}
      <div className="p-6 rounded-lg bg-secondary/50 border border-border">
        <div className="space-y-3">
          <Label
            htmlFor="solution"
            className="text-foreground font-semibold text-xl flex items-center gap-3"
          >
            <FileText className="w-6 h-6 text-primary" />
            Solution
          </Label>
          <Textarea
            id="solution"
            placeholder="Enter your solution here..."
            value={formData.solution}
            onChange={(e) => onChange("solution", e.target.value)}
            className="min-h-[120px] bg-background border-input"
          />
        </div>
      </div>
    </div>
  );
}
