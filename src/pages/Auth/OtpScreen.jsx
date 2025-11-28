import React, { useEffect } from "react";
import { useState, useRef } from "react";
import { Button, Form, Typography, message, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../../api/endpoints/auth";

const { Title, Text } = Typography;

// --- DEDICATED TIMER COMPONENT ---
// This component now holds the 'timer' state and its 'useEffect' hook.
// It will be the ONLY thing that re-renders every second, solving the performance issue.
const TimerAndResend = ({ initialTime = 59, email, onResendSuccess }) => {
  const [timer, setTimer] = useState(initialTime);
  // 1. Timer logic is isolated here
  useEffect(() => {
    if (timer === 0) return; // Stop at zero

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval); // Cleanup
  }, [timer]);

  // 🔁 Resend OTP Mutation
  const resendMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (response) => {
      if (response?.success) {
        message.success("OTP resent successfully");

      } else {
        message.success("OTP resent successfully");
        setTimer(initialTime);
        onResendSuccess?.();
      }
    },
    onError: (error) => {
      message.error(error?.response?.data?.message || "Error resending OTP");
    },
  });

  const handleResendOtp = () => {
    resendMutation.mutate({ email });
  };

  return (
    <div className="flex w-[90%] ml-8 font-b5 text-blackColor gap-20 items-center text-text1 mb-6">
      <span>
        Didn’t you receive the OTP?{" "}
        <button
          type="button"
          onClick={handleResendOtp}
          disabled={timer > 0}
          className={`font-b7 ${timer > 0
            ? "text-gray-400 cursor-not-allowed"
            : "text-mainColor hover:underline"
            }`}
        >
          Resend OTP
        </button>
      </span>
      {/* Timer Display */}
      <span className="text-blackColor font-b5">
        00:{timer.toString().padStart(2, "0")}
      </span>
    </div>
  );
};


const VerifyOtp = () => {
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

    const fullOtp = otp.join(""); // ✅ OTP from input field

    // 👇 Save OTP to localStorage
    localStorage.setItem("otp", fullOtp);

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
      <div className="relative flex-1 flex items-center justify-center h-screen w-full px-4 sm:px-6">
        <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[80%] min-h-[50%] p-4 sm:p-6 md:p-8 rounded-2xl">

          {/* 🔙 Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-2 sm:top-4 left-4 sm:left-6 rounded-full hover:bg-bgColor mt-2 sm:mt-4"
          >
            <FiArrowLeft className="text-xl sm:text-2xl md:text-[28px] text-mainColor" />
          </button>
          {/* Heading */}
          <Title
            level={4}
            className="!m-0 font-b6 text-blackColor !text-xl sm:!text-2xl md:!text-[28px] mb-2"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Verify OTP
          </Title>
          <Text className="block mb-6 sm:mb-8 text-blackColor font-b5 !text-base sm:!text-lg md:!text-[20px]"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            We have sent an OTP to{" "}
            <span className="text-mainColor font-b6 break-all">{email}</span>
          </Text>

          {/* OTP Inputs */}
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item>
              <div className="flex gap-2 sm:gap-3 md:gap-5 justify-center">
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
                    className="w-10 h-12 sm:w-12 sm:h-14 md:w-[65px] md:h-[60px] text-center text-base sm:text-lg rounded-custom border border-custom font-b6 text-blackColor"
                    style={{ border: "1px solid #DBDBDB" }}
                  />
                ))}
              </div>
            </Form.Item>

            {/* Resend + Timer */}
            {/* <div className="flex w-[98%]  font-b5 text-blackColor gap-20 justify-between !text-[16px] mb-6"
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
            </div> */}

            {/* Resend + Timer (Now the isolated component) */}
            <TimerAndResend initialTime={59} email={email} />

            {/* Verify Button */}
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ fontFamily: '"Poppins", sans-serif' }}
              onClick={() => navigate("/auth/reset-password")}
              className="w-[100%] mx-auto mt-4 h-12 sm:h-14 md:h-[60px] rounded-custom !bg-mainColor text-whiteColor text-base sm:text-lg md:text-xl font-b7 border-none"
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
