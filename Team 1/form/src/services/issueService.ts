import api from "./api";
import { IssueDetails } from "@/types/form";

export interface CreateIssuePayload {
  clientName: string;
  clientEmail: string;
  companyName: string;
  subject: string;
  date: string;
  category: string;
  content: string;
  products: string[];
}

export interface IssueAIResponse {
  summarize: string;
  possibleSolution: string;
}

export interface EmailDefaultsResponse {
  clientEmail: string;
  subject: string;
  emailContent: string;
}

export interface SubmitIssuePayload {
  issueId: string;
  employeeName: string | null;
  employeeEmail: string | null;
  clientEmail: string;
  subject: string;
  emailContent: string;
  solution: string;
  aiSolution: string;
}

export interface OpenIssue {
  id: number;
  option: string;
}

export interface OpenIssuesResponse {
  data: OpenIssue[];
}

export const issueService = {
  getIssueDetails: async (issueId: number) => {
    const response = await api.get<IssueDetails>(`/issues/detail`, {
      params: { issue_id: issueId },
    });
    return response.data;
  },

  createIssue: async (payload: CreateIssuePayload) => {
    const response = await api.post("/issues/create", payload);
    return response.data;
  },

  getIssueAI: async (issueId: number) => {
    const response = await api.get<IssueAIResponse>(`/issues/detail/ai`, {
      params: { issue_id: issueId },
    });
    return response.data;
  },

  getEmailDefaults: async (issueId: string, solution: string) => {
    const response = await api.get<EmailDefaultsResponse>(`/email`, {
      params: { issue_id: issueId, solution },
    });
    return response.data;
  },

  submitIssueResolution: async (payload: SubmitIssuePayload) => {
    const response = await api.post("/submit", payload);
    return response.data;
  },

  getOpenIssues: async () => {
    const response = await api.get<OpenIssuesResponse>("/issues/open");
    return response.data;
  },

  getAllIssues: async () => {
    const response = await api.get<IssueDetails[]>("/issues/all");
    return response.data;
  },
};
