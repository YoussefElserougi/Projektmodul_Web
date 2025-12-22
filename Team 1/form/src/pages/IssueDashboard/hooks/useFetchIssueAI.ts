import { useQuery } from "@tanstack/react-query";
import { issueService } from "@/services/issueService";

export const useFetchIssueAI = (issueId: number) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["issueAI", issueId],
    queryFn: () => issueService.getIssueAI(issueId),
    enabled: !!issueId,
  });

  return { data, isLoading, isError };
};
