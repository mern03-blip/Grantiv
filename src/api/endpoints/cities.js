import axiosInstance from "../axios/axiosInstance";



export const getAllCities = async () => {
    const response = await axiosInstance.get("/cities/cities/names");
    return response.data.data;
};
