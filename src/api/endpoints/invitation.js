import axiosInstance from "../axios/axiosInstance";

export const inviteMember = async (organizationId, body) => {
    const response = await axiosInstance.post(
        `/invitation/invite`,
        body,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "X-Organization-ID": organizationId
            },
        }
    );

    return response.data;
};







