import axiosInstance from "../axios/axiosInstance";


//Get All Grants
export const getGrants = async ({
  page = 1,
  limit = 10,
  search = "",
  sortFilter = "",
} = {}) => {
  // Dynamically build params object (only include filled fields)
  const params = {
    page,
    limit,
    ...(search && { search }),
    ...(sortFilter && { sortFilter }),
  };
  
  const response = await axiosInstance.get("/grants/get-grants", { params });

  return response.data;
};

// Single Grant for detail modal
export const getGrantDetail = async (id) => {

  const response = await axiosInstance.get(`/grants/get-grants/${id}`, {
    // params: { 
    //   id,
    // }
  });
  console.log("Single grant", response.data);
  return response.data.data;
};

//Favorite Grant
const userId = localStorage.getItem("userId");
const organizationId = localStorage.getItem("orgId");

export const handleFavoriteGrants = async (grantId) => {
  const response = await axiosInstance.put("/grants/Togglefavorites", {
    userId,
    grantId,
    organizationId,
  });

  // console.log("Favorite grants:", response.data);
  return response.data;
};


//Get Favorite Grants
export const handleGetFavoriteGrants = async () => {
  const response = await axiosInstance.post(`/grants/favorites`, {
    organizationId,
    userId,
  });

  // console.log("Get Favorite grants:", response.data);
  return response.data;
};



//Get Ai Recomanded Grants
export const getAIRecommendedGrants = async () => {
  const token = localStorage.getItem('token');
  const organizationId = localStorage.getItem('orgId');

  if (!token || !organizationId) {
    throw new Error("Authentication details are missing. Please log in again.");
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Organization-ID': organizationId,
    },
  };

  const response = await axiosInstance.get('/organizations/recommendations', config);
  // console.log("API Response:", response.data);

  const { nearestDeadline, recommendedGrants } = response.data;

  // Safely map recommendedGrants
  const formattedGrants = (recommendedGrants || []).map((grant) => ({
    ...grant,
    id: grant._id,
    matchPercentage: Math.round(grant.score * 100),
  }));

  return {
    nearestDeadline,
    recommendedGrants: formattedGrants,
  };
};
