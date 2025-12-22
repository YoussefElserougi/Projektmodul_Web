import { useQuery } from "@tanstack/react-query";
import { issueService } from "@/services/issueService";

export const useFetchIssue = (issueId: number) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["issue", issueId],
    queryFn: () => issueService.getIssueDetails(issueId),
    select: (data) => ({
      ...data,
      products: data.products
        ? typeof data.products === "string"
          ? JSON.parse(data.products)
          : data.products
        : [],
    }),
    enabled: !!issueId,
  });

  return { data, isLoading, isError };
};
