import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleFavoriteGrants } from "../api/endpoints/grants";

export const useToggleFavoriteGrant = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (grantId) => handleFavoriteGrants(grantId),

        onSuccess: (grantId) => {

            queryClient.invalidateQueries(["savedGrants"]);
            // queryClient.invalidateQueries(["grant", grantId]);
        },

        onError: (error) => {
            console.error("Error toggling favorite:", error);
        },
    });
};







