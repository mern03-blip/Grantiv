import React from "react";
import { useState, useRef } from "react";
import { Button, Form, Typography, message, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const { Title, Text } = Typography;

const VerifyOtp = () => {
  // const { mutate: verifyOtp } = useVerifyOtp();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const email = localStorage.getItem("email") || `xyz@gmail.com`;

  const handleChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const onFinish = () => {
    setLoading(true);
    if (otp.some((d) => d === "")) {
      message.error("Please enter all 6 digits of the OTP");
      setLoading(false);
      return;
    }

    const fullOtp = otp.join("");
    const data = {
      email: email,
      otp: fullOtp,
    };

    verifyOtp(data, {
      onSuccess: (response) => {
        message.success(response?.data?.message || "OTP verified successfully");
        navigate("/reset-password");
      },
      onError: (error) => {
        message.error(error?.response?.data?.message || "Error verifying OTP");
      },
      onSettled: () => setLoading(false),
    });
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
          {/* Heading */}
          <Title
            level={4}
            className="!m-0 font-b6 text-blackColor !text-[28px] mb-2"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Verify OTP
          </Title>
          <Text className="block mb-8 text-blackColor font-b5 !text-[20px]"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            We have sent an OTP to{" "}
            <span className="text-mainColor font-b6">{email}</span>
          </Text>

          {/* OTP Inputs */}
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item>
              <div className="flex gap-5 ">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => (inputRefs.current[index] = el)}
                    className="w-[65px] h-[60px] text-center text-lg rounded-custom border border-custom font-b6 text-blackColor"
                    style={{ border: "1px solid #DBDBDB" }}
                  />
                ))}
              </div>
            </Form.Item>

            {/* Resend + Timer */}
            <div className="flex w-[98%]  font-b5 text-blackColor gap-20 justify-between !text-[16px] mb-6"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              <span className="text-blackColor font-b7">
                Didn’t you receive the OTP?{" "}
                <button
                  type="button"
                  className="text-mainColor font-b7 hover:underline"
                >
                  Resend OTP
                </button>
              </span>
              <span className="text-blackColor font-b6">00:59</span>
            </div>

            {/* Verify Button */}
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ fontFamily: '"Poppins", sans-serif' }}
              onClick={() => navigate("/auth/reset-password")}
              className="w-[100%] mx-auto mt-4 h-[60px] rounded-custom !bg-mainColor text-whiteColor font-b7 border-none"
            >
              Verify
            </Button>
          </Form>
        </div>
      </div>
    </>

  );
};

export default VerifyOtp;
