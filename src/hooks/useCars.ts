import { useInfiniteQuery } from "@tanstack/react-query";
import { CarsFilters } from "@/src/lib/cars/types";
import { fetchCars } from "@/src/lib/cars/api";

export function useCars(filters: Omit<Partial<CarsFilters>, "page">) {
    return useInfiniteQuery({
        queryKey: ["cars", filters],
        queryFn: ({ pageParam }) => fetchCars({ ...filters, page: pageParam as number }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.page + 1 : undefined,
        staleTime: 0,
        refetchOnMount: "always",
    });
}