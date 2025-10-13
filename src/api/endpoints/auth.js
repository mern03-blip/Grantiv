import axiosInstance from "../axios/axiosInstance";


//SignUp
export const userSignUp = async (formData) => {

  const response = await axiosInstance.post("/auth/register", {
    ...formData,
  });

   console.log("SignUp", response.data);
  return response.data;
};

//Login
export const userLogin = async (formData) => {
  
  const response = await axiosInstance.post("/auth/login", {
    ...formData,
  });

  //  console.log("Login", response.data);
  return response.data;
};

//Forget Password
  export const forgotPassword = async (formData) => {

    const response = await axiosInstance.post("/auth/forgot-password", {
      ...formData,
    });

    console.log("resend otp", response.data);
    return response.data;
  };

//Reset Password
export const resetPassword = async (formData) => {
  const response = await axiosInstance.post("/auth/reset-password", {
    ...formData,
  });

  console.log("Reset Password", response.data);
  return response.data;
};

//Verify otp
// export const userVerify = async (formData) => {
  
//   const response = await axiosClient.post("/VerifyEmail", {
//     ...formData,
//   });

//    console.log("OtpVerify", response.data);
//   return response.data;
// };

// // Resend Otp
// export const resendOtp = async (formData) => {
  
//   const response = await axiosClient.post("/resendOtp", {
//     ...formData,
//   });

//    console.log("resend otp", response.data);
//   return response.data;
// };







