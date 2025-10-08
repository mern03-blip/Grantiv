import axiosInstance from "../axios/axiosInstance";


//All Grants
export const getGrants = async (page = 1, limit = 10, search = '') => {

  const response = await axiosInstance.get("/grants/get-grants", {
    params: {
      page,
      limit,
      search
    }
  });

  // console.log("All grants", response.data);
  return response.data;
};

// Single Grant for detail modal
export const getGrantDetail = async (id) => {
  console.log("getGrant called with id:", id);

  const response = await axiosInstance.get(`/grants/get-grants/${id}`, {
    // params: { 
    //   id,
    // }
  });
  console.log("Single grant", response.data);
  return response.data;
};

//Favorite Grant
const userId = localStorage.getItem("userId");

export const handleFavoriteGrants = async (grantId) => {
  const response = await axiosInstance.put("/grants/Togglefavorites", {
    userId,
    grantId,
  });

  console.log("Favorite grants:", response.data);
  return response.data;
};




//Get Favorite Grants
export const handleGetFavoriteGrants = async () => {
  const response = await axiosInstance.get(`/grants/favorites/${userId}`);

  console.log("Get Favorite grants:", response.data);
  return response.data;
};