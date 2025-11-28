import React, { useState } from "react";
import { Button, Form, Input, Typography, message } from "antd";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../api/endpoints/auth";
import { useMutation } from "@tanstack/react-query";

const { Title } = Typography;

const ForgetPassword = () => {
  const navigate = useNavigate();

  // ✅ Mutation for forgot password
  const { mutate: handleForgotPassword, isPending: loading } = useMutation({
    mutationFn: (email) => forgotPassword({ email }), // API call
    onSuccess: (response, email) => {
      const userId = response?.userId;
      localStorage.setItem("email", email);
      message.success(response?.message || "OTP sent successfully");
      navigate("/auth/verify-otp");
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while sending OTP";
      message.error(errorMessage);
    },
  });

  // ✅ Form submit handler
  const onFinish = ({ email }) => {
    handleForgotPassword(email);
  };

  return (
    <div className="relative flex-1 flex items-center justify-center h-screen w-full px-4 sm:px-6">
      <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[90%] min-h-[50%] p-4 sm:p-6 md:p-8 rounded-2xl">
        {/* 🔙 Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-2 sm:top-4 left-4 sm:left-6 rounded-full hover:bg-bgColor mt-2 sm:mt-4"
        >
          <FiArrowLeft className="text-xl sm:text-2xl md:text-[28px] text-mainColor" />
        </button>

        <Title
          className="text-blackColor !text-xl sm:!text-2xl md:!text-[28px] font-b6"
          style={{ fontFamily: '"Poppins", sans-serif' }}
        >
          Forget Password
        </Title>
        <Title className="text-blackColor !text-base sm:!text-lg md:!text-[20px] mb-4 sm:mb-6 font-b5">
          We will send an OTP to your registered email address or phone number.
        </Title>

        <Form
          layout="vertical"
          onFinish={onFinish}
          validateTrigger="onChange"
        >
          <Form.Item
            label={
              <span className="font-b5 font-body text-sm sm:text-base text-blackColor !font-custom">
                Email
              </span>
            }
            name="email"
            required={false}
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Enter a valid email address" },
              { max: 254, message: "Email must not exceed 254 characters" },
            ]}
          >
            <Input
              size="large"
              placeholder="Enter email"
              style={{ border: "1px solid #DBDBDB" }}
              className="rounded-lg font-body font-b4 h-10 sm:h-12 md:h-14 p-2 text-sm sm:text-base border-custom hover:border-custom"
              prefix={<FiMail className="text-mainColor text-base sm:text-lg mr-1 sm:mr-2" />}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full h-12 sm:h-14 md:h-16 rounded-2xl !bg-mainColor font-body text-base sm:text-lg md:text-xl border-none font-bold !font-custom"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Send OTP
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ForgetPassword;
