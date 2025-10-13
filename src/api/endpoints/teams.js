import axiosInstance from "../axios/axiosInstance";

// const organizationId = localStorage.getItem("orgId");


// export const getOrganizationMembers = async () => {
//     const response = await axiosInstance.get(`/organizations/members`, 
//        body,
//         {
//             headers: {
//                 "X-Organization-ID": organizationId
//             },
//         }
//     );

//     console.log("Get Members:", response.data);
//     return response.data;
// };


export const getOrganizationMembers = async () => {
  const organizationId = localStorage.getItem("orgId");

  const response = await axiosInstance.get(`/organizations/members`, {
    headers: {
      "X-Organization-ID": organizationId,
    },
  });

  console.log("✅ Get Members:", response.data);
  return response.data;
};
