export interface FormData {
  // Step 2: Dropdown selection
  selectedOption: string;

  // Step 3: Info from webhook (read-only display) + solution input
  infoText: string;
  solution: string;

  aiSolution: string;

  // Step 4: Email form
  clientEmail: string;
  subject: string;
  content: string;
}

export interface DropdownOption {
  id: string;
  label: string;
}

export interface InfoResponse {
  title: string;
  body: string;
}

export interface EmailDefaults {
  clientEmail: string;
  subject: string;
  content: string;
}

export interface IssueDetails {
  id: number;
  status: string;
  email: string;
  name: string;
  subject: string;
  emailContent: string;
  date: string;
  company_name: string;
  category: string;
  products: string[];
  employee_name?: string;
  employee_email?: string;
  employee_message?: string;
  ai_solution?: string;
}

export interface ExtractedInfo {
  company_name: string;
  products: string[];
}

export type FormStep = 1 | 2 | 3 | 4 | 5; // 5 = thank you page
