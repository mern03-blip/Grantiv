import React from "react";
import { useState } from "react";
import { Button, Form, Input, Typography, message } from "antd";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const ForgetPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // const { mutate: sendOtp } = useSendOtp();

  const onFinish = ({ email }) => {
  //   setLoading(true);
  //   const data = { email };
  //   localStorage.setItem("email", email);

  //   sendOtp(data.email, {
  //     onSuccess: (response) => {
  //       const userId = response?.userId;
  //       const messageContent = response?.message || "OTP sent successfully";

  //       if (userId) {
  //         localStorage.setItem("userId", userId);
  //       }

  //       message.success(messageContent);
  //       navigate("/verify-otp");
  //     },
  //     onError: (error) => {
  //       console.error("API Error:", error);
  //       const errorMessage =
  //         error?.response?.data?.message ||
  //         "An error occurred while sending OTP";
  //       message.error(errorMessage);
  //     },
  //     onSettled: () => {
  //       setLoading(false);
  //     },
  //   });
  };

  return (
    <>

      <div className="relative flex-1 flex items-center justify-center h-screen w-full">
        <div className="w-[80%] h-[50%]  p-6  rounded-2xl">

          {/* 🔙 Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4  rounded-full hover:bg-bgColor mt-4"
          >
            <FiArrowLeft className="text-[28px] text-mainColor" />
          </button>

          <Title className="text-blackColor !text-[28px]  font-b6"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Forget Password
          </Title>
          <Title className="text-blackColor !text-[20px] mb-6  font-b5"
          >
            We will send an OTP to your registered email address or phone number.
          </Title>

          <Form layout="vertical" onFinish={onFinish} validateTrigger="onChange">
            <Form.Item
              label={
                <span className="font-b5  font-body text-blackColor !font-custom">Email</span>
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
                className="rounded-lg font-body font-b4 h-14 p-2 text-sm border-custom hover:border-custom"
                prefix={<FiMail className="text-mainColor text-lg mr-2" />}
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              onClick={() => navigate("/auth/verify-otp")}
              className="w-full h-14 rounded-2xl !bg-mainColor font-body text-xl border-none font-bold !font-custom"
              style={{ fontFamily: '"Poppins", sans-serif' }}

            >
              Send OTP
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;
