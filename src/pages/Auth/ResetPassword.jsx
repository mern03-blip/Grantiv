import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Typography, Modal, message } from "antd";
import { FiArrowLeft, FiLock } from "react-icons/fi";
import { EyeTwoTone, EyeInvisibleOutlined, CloseOutlined } from "@ant-design/icons";
import { FeaturedIcon } from "../../assets/image";
import { resetPassword } from "../../api/endpoints/auth";
import { useMutation } from "@tanstack/react-query";

const { Title } = Typography;

const ResetPassword = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // ✅ React Query Mutation for Reset Password

  const { mutate: handleResetPassword, isPending: loading } = useMutation({
    mutationFn: async (payload) => await resetPassword(payload),
    onSuccess: (res) => {
      message.success(res?.message || "Password updated successfully!");
      setIsModalVisible(true); // ✅ show success popup
      localStorage.removeItem("otp");
      localStorage.removeItem("email");
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while resetting password";
      message.error(errorMessage);
    },
  });

  // ✅ Form Submit Handler
  const onFinish = (values) => {
    const resetToken = localStorage.getItem("otp");

    if (!resetToken) {
      message.error("OTP token not found. Please verify your OTP again.");
      return;
    }

    const payload = {
      resetToken,
      newPassword: values.newPassword,
    };
    console.log(payload);

    handleResetPassword(payload);
  };

  return (
    <>
      <div className="relative flex-1 flex items-center justify-center h-screen w-full px-4 sm:px-6">
        <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[90%] min-h-[50%] p-4 sm:p-6 md:p-8 rounded-2xl">

          {/* 🔙 Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-2 sm:top-4 left-4 sm:left-6 rounded-full hover:bg-bgColor mt-2 sm:mt-4"
          >
            <FiArrowLeft className="text-xl sm:text-2xl md:text-[28px] text-mainColor" />
          </button>

          <Title className=" text-blackColor !text-xl sm:!text-2xl md:!text-[28px]  font-b6"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Reset Password
          </Title>
          <Title className="!text-base sm:!text-lg md:!text-[20px] text-blackColor !mb-6 sm:!mb-8 font-b5"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            You can now reset your password.
          </Title>

          <Form layout="vertical" onFinish={onFinish} validateTrigger="onChange">
            {/* New Password */}
            <Form.Item
              label={
                <span className="font-b5 text-sm sm:text-base text-blackColor !font-custom">
                  Password
                </span>
              }
              name="newPassword"
              required={false}
              rules={[
                { required: true, message: "Please enter your password" },
                {
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])(?!.*\s).{6,128}$/,
                  message:
                    "Password must include uppercase, lowercase, number",
                },
              ]}
            >
              <Input.Password
                size="large"
                placeholder="***********"
                style={{ border: "1px solid #DBDBDB" }}
                className="rounded-custom h-10 sm:h-11 md:h-12 p-2 text-sm sm:text-base font-body border-custom"
                prefix={<FiLock className="text-mainColor text-base sm:text-lg md:text-[20px]" />}
                iconRender={(visible) =>
                  visible ? (
                    <EyeTwoTone twoToneColor="#9CCC5A" style={{ color: "#9CCC5A", fontSize: window.innerWidth < 640 ? "20px" : "24px" }} />
                  ) : (
                    <EyeInvisibleOutlined style={{ color: "#9CCC5A", fontSize: window.innerWidth < 640 ? "20px" : "24px" }} />
                  )
                }
              />
            </Form.Item>

            {/* Confirm Password */}
            <Form.Item
              label={
                <span className="font-b5 text-sm sm:text-base text-blackColor"
                  style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                  Confirm Password
                </span>
              }
              name="confirmPassword"
              required={false}
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Please confirm your new password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject("Passwords do not match!");
                  },
                }),
              ]}
            >
              <Input.Password
                size="large"
                placeholder="***********"
                style={{ border: "1px solid #DBDBDB" }}
                className="rounded-custom h-10 sm:h-11 md:h-12 p-2 text-sm sm:text-base font-body border-custom"
                prefix={<FiLock className="text-mainColor text-base sm:text-lg md:text-[20px]" />}
                iconRender={(visible) =>
                  visible ? (
                    <EyeTwoTone twoToneColor="#9CCC5A" style={{ color: "#9CCC5A", fontSize: window.innerWidth < 640 ? "20px" : "24px" }} />
                  ) : (
                    <EyeInvisibleOutlined style={{ color: "#9CCC5A", fontSize: window.innerWidth < 640 ? "20px" : "24px" }} />
                  )
                }
                onCopy={(e) => e.preventDefault()}
                onPaste={(e) => e.preventDefault()}
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              // onClick={() => {
              //   setIsModalVisible(true);
              // }}
              className="w-full h-12 sm:h-14 md:h-16 rounded-2xl text-base sm:text-lg md:text-xl font-bold !bg-mainColor border-none !font-custom"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Save
            </Button>
          </Form>
        </div>


        {/* ✅ Success Popup */}
        <Modal
          centered
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={window.innerWidth < 640 ? "90%" : window.innerWidth < 768 ? 380 : 450}
          closable={false} // We will use a custom close button
          className="rounded-custom" // Use your custom border-radius
        >
          <div className="font-custom flex flex-col items-left p-4 sm:p-6 text-left">

            {/* Custom Close Button in the top-right corner */}
            <button
              onClick={() => setIsModalVisible(false)}
              className="absolute top-4 sm:top-6 right-4 sm:right-6 text-mainColor transition hover:opacity-75"
            >
              <CloseOutlined style={{ fontSize: window.innerWidth < 640 ? '16px' : '20px' }} />
            </button>

            {/* Custom Checkmark Icon with double ring */}
            <div>
              <div>
                <img src={FeaturedIcon} alt="Featured Icon" className="w-12 sm:w-16" />
              </div>
            </div>

            {/* Text Content */}
            <Typography.Title level={4} className="!font-b6 !text-lg sm:!text-xl md:!text-h1 !text-blackColor"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Password Updated
            </Typography.Title>

            <p className="mt-2 mb-6 sm:mb-8 font-b5 text-sm sm:text-base md:text-h4 text-blackColor"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Your password has been updated successfully.
            </p>

            {/* Login Button */}
            <Button
              type="primary"
              className="!h-10 sm:!h-12 w-full !rounded-custom !bg-mainColor !font-b6 !text-sm sm:!text-base md:!text-h4 !text-whiteColor"
              style={{ fontFamily: '"Poppins", sans-serif' }}
              onClick={() => {
                setIsModalVisible(false);
                navigate("/auth"); // Navigate to your login route
              }}
            >
              Login
            </Button>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default ResetPassword;
