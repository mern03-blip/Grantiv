import axiosInstance from "../axios/axiosInstance";

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

export const updateMemberRole = async (memberId, newRole) => {

  const organizationId = localStorage.getItem("orgId");
  const userId = localStorage.getItem("userId");

  const response = await axiosInstance.put(
    `/organizations/members/${memberId}`,
    {
      role: newRole,
      organizationId,
      userId,

    }, // ✅ body (role to update)
    {
      headers: {
        "X-Organization-ID": organizationId,
      },
    }
  );

  console.log("✅ update Members role:", response.data);
  return response.data;
};


export const deleteMember = async (memberId) => {
  const organizationId = localStorage.getItem("orgId");
  const userId = localStorage.getItem("userId");

  const response = await axiosInstance.delete(
    `/organizations/members/${memberId}`,
    {
      // ✅ DELETE request body (optional)
      data: {
        organizationId,
        userId,
      },
      // ✅ Proper headers
      headers: {
        "X-Organization-ID": organizationId,
      },
    }
  );

  console.log("✅ delete Members:", response.data);
  return response.data;
};
