import axiosInstance from "../axios/axiosInstance";


export const handleOnboardingForm = async (profiledata) => {
    const organizationId = localStorage.getItem("orgId");

    const response = await axiosInstance.post(
        `/organizations/profile`,
        profiledata,
        {
            headers: {
                "X-Organization-ID": organizationId,
            },
        }
    );

    return response.data;
};


export const handleBusinessForm = async () => {
    const organizationId = localStorage.getItem("orgId");

    const response = await axiosInstance.get(`/organizations/profile`,
        {
            headers: {
                "X-Organization-ID": organizationId,
            },
        }
    );


    return response.data;
};