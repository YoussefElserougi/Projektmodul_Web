import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Loader2,
  Calendar,
  Mail,
  Building,
  Tag,
  User,
  Bot,
  Hash,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RoutePaths } from "../enum";
import { useFetchAllIssues } from "../IssueDashboard/hooks/useFetchAllIssues";

export const AllIssues = () => {
  const navigate = useNavigate();

  const { data, isError, isLoading } = useFetchAllIssues();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading issues...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-destructive mb-2">Failed to load issues.</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(RoutePaths.TOOLS)}
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-3xl font-bold">All Issues</h1>
        </div>
        <div className="flex items-center justify-center h-[50vh]">
          <Card className="border-border shadow-2xl bg-card/95 backdrop-blur-sm w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                No Issues Found
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                There are currently no issues to display.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(RoutePaths.TOOLS)}
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-3xl font-bold">All Issues</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((issue) => (
          <Card key={issue.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl truncate pr-2">
                  {issue.subject}
                </CardTitle>
                <Badge
                  variant={
                    issue.status === "open"
                      ? "destructive"
                      : issue.status === "in_progress"
                      ? "default"
                      : "secondary"
                  }
                >
                  {issue.status.replace("_", " ")}
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4" />
                {new Date(issue.date).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building className="w-4 h-4" />
                <span className="font-medium text-foreground">
                  {issue.company_name}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{issue.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Tag className="w-4 h-4" />
                <span className="capitalize">{issue.category}</span>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {issue.products.map((product, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {product}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full">View Details</Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center gap-2">
                      <Hash className="w-5 h-5 text-muted-foreground" />
                      {issue.id} - {issue.subject}
                    </DialogTitle>
                    <DialogDescription>
                      Created on {new Date(issue.date).toLocaleString()}
                    </DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="h-full max-h-[70vh] pr-4">
                    <div className="grid gap-6 py-4">
                      {/* Status & Category */}
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">Status:</span>
                          <Badge
                            variant={
                              issue.status === "open"
                                ? "destructive"
                                : issue.status === "in_progress"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {issue.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">Category:</span>
                          <Badge variant="outline" className="capitalize">
                            {issue.category}
                          </Badge>
                        </div>
                      </div>

                      {/* Client Info */}
                      <div className="space-y-2 border p-4 rounded-lg bg-muted/20">
                        <h3 className="font-semibold flex items-center gap-2">
                          <User className="w-4 h-4" /> Client Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Name:</span>{" "}
                            {issue.name}
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Email:
                            </span>{" "}
                            {issue.email}
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Company:
                            </span>{" "}
                            {issue.company_name}
                          </div>
                        </div>
                      </div>

                      {/* Products */}
                      <div>
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <Tag className="w-4 h-4" /> Products
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {issue.products.map((product, index) => (
                            <Badge key={index} variant="secondary">
                              {product}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Email Content */}
                      <div>
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <Mail className="w-4 h-4" /> Original Request
                        </h3>
                        <div
                          className="p-4 rounded-lg border bg-card text-sm"
                          dangerouslySetInnerHTML={{
                            __html: issue.emailContent,
                          }}
                        />
                      </div>

                      {/* Employee Info */}
                      {(issue.employee_name || issue.employee_email) && (
                        <div className="space-y-2 border p-4 rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
                          <h3 className="font-semibold flex items-center gap-2">
                            <User className="w-4 h-4" /> Assigned Employee
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            {issue.employee_name && (
                              <div>
                                <span className="text-muted-foreground">
                                  Name:
                                </span>{" "}
                                {issue.employee_name}
                              </div>
                            )}
                            {issue.employee_email && (
                              <div>
                                <span className="text-muted-foreground">
                                  Email:
                                </span>{" "}
                                {issue.employee_email}
                              </div>
                            )}
                          </div>
                          {issue.employee_message && (
                            <div className="mt-2 pt-2 border-t border-border/50">
                              <span className="text-muted-foreground block mb-1 text-xs uppercase tracking-wider">
                                Internal Note
                              </span>
                              <p className="text-sm">
                                {issue.employee_message}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* AI Solution */}
                      {issue.ai_solution && (
                        <div className="space-y-2 border p-4 rounded-lg bg-purple-50/50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900">
                          <h3 className="font-semibold flex items-center gap-2 text-purple-700 dark:text-purple-400">
                            <Bot className="w-4 h-4" /> AI Suggestion
                          </h3>
                          <p className="text-sm leading-relaxed">
                            {issue.ai_solution}
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
