import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleFavoriteGrants } from "../api/endpoints/grants";
import { message } from "antd";

export const useToggleFavoriteGrant = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (grantId) => handleFavoriteGrants(grantId),

        onSuccess: (data, grantId) => {
            message.success("Favorites updated!");

            // ✅ Optional: update local cache instantly
            queryClient.invalidateQueries(["savedGrants"]);
            queryClient.invalidateQueries(["grant", grantId]);
        },

        onError: (error) => {
            console.error("Error toggling favorite:", error);
            message.error("Failed to update favorites.");
        },
    });
};
