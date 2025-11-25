import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Input, message } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { User, Mail } from "../../assets/image";
import { FiLock } from "react-icons/fi";
import { userSignUp } from "../../api/endpoints/auth";
import { useMutation } from "@tanstack/react-query";

const SignUp = () => {

  const navigate = useNavigate();

  // ✅ TanStack Mutation Hook
  const { mutate: handleSignUp, isPending: loading } = useMutation({
    mutationFn: async ({ email, password, name, organizationName }) => {
      const response = await userSignUp({ email, password, name, organizationName });
      return response;
    },
    onSuccess: (response, variables) => {
      if (response?.token) {
        message.success(response.message || "Signup successful! Please verify your email.");
        localStorage.setItem("email", variables.email);
        navigate("/auth");
      } else {
        message.error(response.message || "Signup failed. Please try again.");
      }
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred during signup.";
      if (errorMessage.toLowerCase().includes("email already exists")) {
        message.error("An account with this email already exists. Please log in.");
      } else {
        message.error(errorMessage);
      }
    },
  });

  // ✅ Form Submit Handler
  const onFinish = (values) => {
    console.log(values);

    const { email, password, fullName, organizationName } = values;
    handleSignUp({ email, password, name: fullName, organizationName });
  };

  return (
    <div className="w-full h-[100%] flex justify-center font-custom overflow-y-auto no-scrollbar">
      <div className="w-[80%] p-6">

        {/* Heading Section */}
        <div className="mb-8 text-start">
          <h1
            className="font-b6 text-text3 text-blackColor"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Sign Up
          </h1>
          <p
            className="mt-2 font-b5 text-h3 text-blackColor"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Enter your details to get access.
          </p>
        </div>

        {/* Ant Design Form */}
        <Form
          name="signup"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          {/* Full Name Field */}
          <Form.Item
            name="fullName"
            required={false}
            label={<span className="font-b5 text-h4 text-blackColor !font-custom">Full Name</span>}
          // rules={[
          //   { required: true, message: "Please enter your full name!" },
          //   {
          //     pattern: /^[A-Za-z'-]{1,50}$/,
          //     message:
          //       "Full name must only contain letters, optional hyphens or apostrophes, and be 1–50 characters long",
          //   },
          // ]}
          >
            <Input
              prefix={<img src={User} alt="User Icon" className="mr-2 text-mainColor" />}
              style={{ border: "1px solid #DBDBDB" }}
              placeholder="Enter name"
              size="large"
              className="h-12 rounded-custom border-custom text-h4 hover:border-custom placeholder-primaryTextColor focus:border-mainColor focus:ring-1 focus:ring-mainColor"
            />
          </Form.Item>

          {/* Email Field */}
          <Form.Item
            name="email"
            required={false}
            label={<span className="font-b5 text-h4 text-blackColor !font-custom">Email</span>}
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Enter a valid email address" },
              { max: 254, message: "Email must not exceed 254 characters" },
            ]}
          >
            <Input
              prefix={<img src={Mail} alt="Mail Icon" className="mr-2 text-mainColor" />}
              style={{ border: "1px solid #DBDBDB" }}
              placeholder="Enter email"
              size="large"
              className="h-12 rounded-custom border-custom hover:border-custom text-h4 placeholder-primaryTextColor focus:border-mainColor focus:ring-1 focus:ring-mainColor"
            />
          </Form.Item>

          {/* Password Field */}
          <Form.Item
            name="password"
            required={false}
            label={<span className="font-b5 text-h4 text-blackColor !font-custom">Password</span>}
            rules={[
              { required: true, message: "Please enter your password" },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])(?!.*\s).{6,128}$/,
                message:
                  "Password must include uppercase, lowercase, number, and a special character",
              },
            ]}
          >
            <Input.Password
              prefix={<FiLock className="mr-2 size-5 text-mainColor" />}
              placeholder="**********"
              style={{ border: "1px solid #DBDBDB" }}
              size="large"
              className="h-12 rounded-custom border-custom hover:border-custom text-h4 placeholder-primaryTextColor focus:border-mainColor focus:ring-1 focus:ring-mainColor"
              iconRender={(visible) =>
                visible ? (
                  <EyeTwoTone twoToneColor="#9CCC5A" style={{ color: "#9CCC5A", fontSize: "24px" }} />
                ) : (
                  <EyeInvisibleOutlined style={{ color: "#9CCC5A", fontSize: "24px" }} />
                )
              }
            />
          </Form.Item>

          {/* Confirm Password Field */}
          <Form.Item
            name="confirmPassword"
            required={false}
            label={<span className="font-b5 text-h4 text-blackColor !font-custom">Confirm Password</span>}
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("The two passwords that you entered do not match!"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<FiLock className="mr-2 size-5 text-mainColor" />}
              placeholder="**********"
              style={{ border: "1px solid #DBDBDB" }}
              size="large"
              className="h-12 rounded-custom border-custom text-h4 hover:border-custom placeholder-primaryTextColor focus:border-mainColor focus:ring-1 focus:ring-mainColor"
              iconRender={(visible) =>
                visible ? (
                  <EyeTwoTone twoToneColor="#9CCC5A" style={{ color: "#9CCC5A", fontSize: "24px" }} />
                ) : (
                  <EyeInvisibleOutlined style={{ color: "#9CCC5A", fontSize: "24px" }} />
                )
              }
            />
          </Form.Item>

          <Form.Item
            name="organizationName"
            required={false}
            label={
              <span className="font-b5 text-h4 text-blackColor !font-custom">
                Organization Name
              </span>
            }
          // rules={[
          //   { required: true, message: "Please enter your organization name!" },
          //   {
          //     pattern: /^[A-Za-z0-9&'-. ]{2,100}$/,
          //     message:
          //       "Organization name can include letters, numbers, spaces, and & ' - . characters (2–100 chars)",
          //   },
          // ]}
          >
            <Input
              // prefix={<img src={BuildingIcon} alt="Building Icon" className="mr-2 text-mainColor" />}
              style={{ border: "1px solid #DBDBDB" }}
              placeholder="Enter organization name"
              size="large"
              className="h-12 rounded-custom border-custom text-h4 hover:border-custom placeholder-primaryTextColor"
            />
          </Form.Item>


          {/* Submit Button */}
          <Form.Item className="!mt-6">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ fontFamily: '"Poppins", sans-serif' }}
              className="w-[100%] h-[60px] flex justify-center !font-custom rounded-custom !bg-mainColor text-whiteColor font-b7 text-h2 border-none"
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        {/* Footer Link */}
        <p className="mt-10 pb-10 text-center text-text1 text-gray-400 !font-custom">
          Already have an account?{" "}
          <Link to="/auth" className="text-mainColor font-b6 !font-custom">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;