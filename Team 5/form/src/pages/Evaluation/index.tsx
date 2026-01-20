import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  Download,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RoutePaths } from "../enum";

interface EvaluationResult {
  id: string;
  testCase: {
    vars: {
      input: string;
    };
    assert: {
      type: string;
      value: string;
    }[];
  };
  prompt: {
    raw: string;
  };
  response: {
    output?: string;
    error?: string;
  };
  gradingResult?: {
    pass: boolean;
    reason: string;
    score: number;
  };
  gradingResultReason?: string;
  error?: string;
  success: boolean;
  score: number;
}

export const Evaluation = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<EvaluationResult[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload a CSV or Excel file.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResults([]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Evaluation failed");
      }

      const data = await response.json();

      if (data.results && Array.isArray(data.results)) {
        setResults(data.results);
      } else {
        console.warn("Unexpected response format", data);
        toast({
          title: "Warning",
          description: "Format of response is unexpected, check console.",
          variant: "default",
        });
      }

      toast({
        title: "Evaluation Complete",
        description: `Processed ${data.results?.length || 0} rows.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to process the file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (results.length === 0) return;

    // Define headers
    const headers = [
      "Input",
      "Actual Output",
      "Expected Ref",
      "Failure Reason",
      "Score",
      "Status",
    ];

    // Map results to rows
    const rows = results.map((result) => {
      const input = result.testCase.vars.input;

      // Extract display output similarly to the table render logic
      const displayOutput =
        result.response.output ||
        result.response.error ||
        result.error ||
        "No output";

      const expected =
        result.testCase.assert.length > 0
          ? result.testCase.assert[0].value
          : "";

      const reason = !result.success
        ? result.gradingResult.reason ||
          result.gradingResultReason ||
          result.response.error ||
          "Unknown error"
        : "-";
      const score = result.score;
      const status = result.success ? "Pass" : "Fail";

      return [input, displayOutput, expected, reason, score, status];
    });

    // Convert to CSV string
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((cell) => {
            // Escape quotes and wrap in quotes if necessary
            const cellStr = String(cell);
            if (
              cellStr.includes(",") ||
              cellStr.includes('"') ||
              cellStr.includes("\n")
            ) {
              return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
          })
          .join(",")
      ),
    ].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `evaluation_results_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-full space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              AI Quality Evaluation
            </h1>
            <p className="text-muted-foreground mt-2">
              Upload a dataset to evaluate your n8n workflow against expected
              outputs.
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate(RoutePaths.TOOLS)}>
            Back to Tools
          </Button>
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              Upload Dataset
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept=".csv, .xlsx"
                onChange={handleFileChange}
                className="max-w-sm cursor-pointer"
              />
              <Button onClick={handleUpload} disabled={loading || !file}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {loading ? "Evaluating..." : "Run Evaluation"}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Supported formats: CSV, Excel. Columns required:{" "}
              <code>input</code>, <code>output</code>.
            </p>
          </CardContent>
        </Card>

        {/* Results Section */}
        {results.length > 0 && (
          <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Evaluation Results
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="ml-auto gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Input</TableHead>
                      <TableHead className="w-[200px]">
                        Expected Output
                      </TableHead>
                      <TableHead className="w-[300px]">Actual Output</TableHead>
                      <TableHead className="w-[200px]">
                        Failure Reason
                      </TableHead>
                      <TableHead className="text-right">Score</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((result, idx) => {
                      const input = result?.testCase?.vars?.input || "N/A";

                      // Handling output: It might be a JSON string wrapper from the provider
                      const rawOutput =
                        result?.response?.output ||
                        result?.response?.error ||
                        result?.error ||
                        "No output";
                      let displayOutput = rawOutput;
                      try {
                        const str =
                          typeof rawOutput === "string"
                            ? rawOutput.trim()
                            : JSON.stringify(rawOutput);
                        if (str.startsWith("{") || str.startsWith("[")) {
                          const parsed = JSON.parse(str);

                          // Helper to find best content
                          const extractContent = (obj: any): string | null => {
                            if (!obj) return null;
                            if (typeof obj === "string") return obj;
                            if (Array.isArray(obj)) {
                              if (obj.length === 1)
                                return extractContent(obj[0]);
                              return JSON.stringify(obj, null, 2);
                            }
                            if (typeof obj === "object") {
                              // Prioritize specific keys
                              if (obj.output)
                                return typeof obj.output === "string"
                                  ? obj.output
                                  : JSON.stringify(obj.output);
                              if (obj.result)
                                return typeof obj.result === "string"
                                  ? obj.result
                                  : JSON.stringify(obj.result);
                              if (obj.text)
                                return typeof obj.text === "string"
                                  ? obj.text
                                  : JSON.stringify(obj.text);
                              if (obj.content)
                                return typeof obj.content === "string"
                                  ? obj.content
                                  : JSON.stringify(obj.content);
                              // Fallback
                              return JSON.stringify(obj, null, 2);
                            }
                            return String(obj);
                          };

                          const extracted = extractContent(parsed);
                          if (extracted !== null) {
                            displayOutput = extracted;
                          }
                        }
                      } catch (e) {
                        // Failed to parse, use raw
                      }

                      // Safe assertion access
                      const assertionValue =
                        result?.testCase?.assert?.[0]?.value || "";
                      const expectedPreview = assertionValue
                        ? assertionValue.replace(
                            "The response must be semantically similar to this reference:\n\n",
                            ""
                          )
                        : "N/A";

                      // Failure reason
                      const reason = !result?.success
                        ? result?.gradingResult?.reason ||
                          result?.gradingResultReason ||
                          result?.response?.error ||
                          "Unknown error"
                        : "-";

                      return (
                        <TableRow key={idx} className="h-auto">
                          <TableCell className="font-medium align-top py-4">
                            <div className="whitespace-pre-wrap line-clamp-4 hover:line-clamp-none">
                              {input}
                            </div>
                          </TableCell>
                          <TableCell className="align-top py-4 text-muted-foreground italic">
                            <div className="whitespace-pre-wrap">
                              {expectedPreview}
                            </div>
                          </TableCell>
                          <TableCell className="align-top py-4">
                            <div className="whitespace-pre-wrap font-mono text-xs bg-muted/50 p-2 rounded max-h-[200px] overflow-y-auto">
                              {displayOutput}
                            </div>
                          </TableCell>
                          <TableCell className="align-top py-4 text-red-500 text-sm">
                            {reason !== "-" && (
                              <div className="whitespace-pre-wrap">
                                {reason}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="align-top py-4 text-right font-bold w-[80px]">
                            {result?.score ?? 0}
                          </TableCell>
                          <TableCell className="align-top py-4 text-right w-[100px]">
                            {result?.success ? (
                              <div className="flex items-center justify-end gap-2 text-green-500 font-medium">
                                <CheckCircle className="w-5 h-5" />
                                <span>Pass</span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-end gap-2 text-red-500 font-medium">
                                <XCircle className="w-5 h-5" />
                                <span>Fail</span>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
