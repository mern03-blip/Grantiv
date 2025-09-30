
import { message } from "antd";
import { login, verifyOtp, resendOtp } from "../../../api/endpoints/auth";
import { useMutation } from "@tanstack/react-query";


export const useLoginMutation = () => {

  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      message.success(response.data.message || "Login successful!");

    },
    onError: (error) => {
      message.error(error.response?.data?.message || "Login failed!");
    },
  });
};
// .................verify otp....................

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: verifyOtp,
    onSuccess: (response) => {
      const { _id, role } = response?.data?.admin;
      console.log(response?.data?.token, "token");
      localStorage.setItem("token", response?.data?.token);
      localStorage.setItem("role", role);

      localStorage.setItem("Id", _id);
    },
    onError: (error) => {
      message.error(error.response?.data?.message || "Otp not sent!");
    },

  });
};

// ......................Resend OTP..................

export const useResendOtp = () => {

  return useMutation({
    mutationFn: resendOtp,
    onSuccess: (response) => {
      message.success(response.data.message || "Otp sent!");

    },
    onError: (error) => {
      message.error(error.response?.data?.message || "Otp not sent!");
    },
  });
};