import { issueService } from "@/services/issueService";
import { useQuery } from "@tanstack/react-query";

export const useFetchAllIssues = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["allIssues"],
    queryFn: () => issueService.getAllIssues(),
  });

  return { data, isLoading, isError };
};
