import { useQuery } from "@tanstack/react-query";
import { getAllCities } from "../api/endpoints/cities";

export const useCitiesQuery = () => {
    return useQuery({
        queryKey: ["cities"],
        queryFn: getAllCities,
        staleTime: 1000 * 60 * 10, // 10 min caching
        retry: 2, // retry twice if fails
    });
};