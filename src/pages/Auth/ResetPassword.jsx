import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Typography, Modal } from "antd";
import { FiArrowLeft, FiLock } from "react-icons/fi";
import { EyeTwoTone, EyeInvisibleOutlined, CloseOutlined } from "@ant-design/icons";
// import { useUpdatePassword } from "../../firebase/collection/authHooks";
import { FeaturedIcon } from "../../assets/image";

const { Title } = Typography;

const ResetPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // const { mutate: resetPassword } = useUpdatePassword();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const onFinish = ({ newPassword }) => {
    setLoading(true);
    const email = localStorage.getItem("email") || `admin@gmail.com`;
    const payload = { email, newPassword };

    resetPassword(payload, {
      onSuccess: () => {
        setLoading(false);
        setIsModalVisible(true); // 👈 show popup
      },
      onError: () => {
        setLoading(false);
      },
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

          <Title className=" text-blackColor !text-[28px]  font-b6"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Reset Password
          </Title>
          <Title className="!text-[20px] text-blackColor !mb-8 font-b5"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            You can now reset your password.
          </Title>

          <Form layout="vertical" onFinish={onFinish} validateTrigger="onChange">
            {/* New Password */}
            <Form.Item
              label={
                <span className="font-b5  text-blackColor !font-custom">
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
                className="rounded-custom h-12 p-2 text-sm font-body border-custom"
                prefix={<FiLock className="text-mainColor text-[20px]" />}
                iconRender={(visible) =>
                  visible ? (
                    <EyeTwoTone twoToneColor="#9CCC5A" style={{ color: "#9CCC5A", fontSize: "24px" }} />
                  ) : (
                    <EyeInvisibleOutlined style={{ color: "#9CCC5A", fontSize: "24px" }} />
                  )
                }
              />
            </Form.Item>

            {/* Confirm Password */}
            <Form.Item
              label={
                <span className="font-b5  text-blackColor"
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
                className="rounded-custom h-12 p-2 text-sm font-body border-custom"
                prefix={<FiLock className="text-mainColor text-[20px]" />}
                iconRender={(visible) =>
                  visible ? (
                    <EyeTwoTone twoToneColor="#9CCC5A" style={{ color: "#9CCC5A", fontSize: "24px" }} />
                  ) : (
                    <EyeInvisibleOutlined style={{ color: "#9CCC5A", fontSize: "24px" }} />
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
              onClick={() => {
                setIsModalVisible(true);
              }}
              className="w-full h-14 rounded-2xl font-bold !bg-mainColor border-none !font-custom"
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
          width={450} // Set a fixed width for better control
          closable={false} // We will use a custom close button
          className="rounded-custom" // Use your custom border-radius
        >
          <div className="font-custom flex flex-col items-left p-6 text-left">

            {/* Custom Close Button in the top-right corner */}
            <button
              onClick={() => setIsModalVisible(false)}
              className="absolute top-6 right-6 text-mainColor transition hover:opacity-75"
            >
              <CloseOutlined style={{ fontSize: '20px' }} />
            </button>

            {/* Custom Checkmark Icon with double ring */}
            <div>
              <div>
                <img src={FeaturedIcon} alt="Featured Icon" />
              </div>
            </div>

            {/* Text Content */}
            <Typography.Title level={4} className="!font-b6 !text-h1 !text-blackColor"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Password Updated
            </Typography.Title>

            <p className="mt-2 mb-8 font-b5 text-h4 text-blackColor"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Your password has been updated successfully.
            </p>

            {/* Login Button */}
            <Button
              type="primary"
              className="!h-12 w-full !rounded-custom !bg-mainColor !font-b6 !text-h4 !text-whiteColor"
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
