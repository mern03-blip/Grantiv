import axiosClient from "./axiosClient";



//Grant
export const getGrants = async ( page = 1, limit = 10, search = '') => {

  const response = await axiosClient.get("/grants/get-grants", {
    params: {
      page,
      limit,
      search
    }
  });

   console.log("All grants", response.data);
  return response.data;
};

