import React from "react";
import { useState } from "react";
import { Button, Col, Divider, Form, Input, message, Row, Typography } from "antd";
import { FiMail, FiLock } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { Apple, Google } from "../../assets/image";
import { EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";
import { userLogin } from "../../api/endpoints/auth";
import { useMutation } from "@tanstack/react-query";

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();

  // ✅ TanStack Mutation for Login API
  const { mutate: handleLogin, isPending: loading } = useMutation({
    mutationFn: async ({ email, password }) => {
      const response = await userLogin({ email, password });
      return response;
    },
    onSuccess: (response) => {
      console.log("Login", response);

      if (response?.token) {

        const organizations = response.organizations

        localStorage.setItem("token", response.token);
        localStorage.setItem("userId", response.id);
        message.success(response.message || "Login successful");
        navigate('/organization-page', {
          state: {
            organizations: organizations
          }
        })
      } else {
        message.error(response.message || "Invalid email or password");
      }
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      message.error(errorMessage);
      console.error("Login Error:", error);
    },
  });



  // ✅ Form Submit Handler
  const onFinish = (values) => {
    const { email, password } = values;
    handleLogin({ email, password });
  };


  const preventCopyPaste = (e) => {
    e.preventDefault();
    message.warning("Copy/Paste is disabled for security reasons.");
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center !font-custom">
      <div className="w-[80%] p-6">
        {/* Heading */}
        <Title level={3} className="!m-0 !text-text3 !font-b6 text-blackColor !font-custom"
          style={{ fontFamily: '"Poppins", sans-serif' }}
        >
          Login
        </Title>
        <p className="text-h3 text-blackColor font-b5 mt-1"
          style={{ fontFamily: '"Poppins", sans-serif' }}
        >
          Enter your details to get access.
        </p>

        <Form layout="vertical" onFinish={onFinish} validateTrigger="onChange" className="mt-6">
          {/* Email Field */}
          <Form.Item
            label={<span className="font-b5 text-h4 text-blackColor !font-custom">Email</span>}
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
              style={{ border: "2px solid #DBDBDB" }}
              className="w-[100%] rounded-custom !border !border-grey-500 h-12 hover:border-custom"
              prefix={<FiMail className="text-mainColor text-lg mr-2" />}
            />
          </Form.Item>

          {/* Password Field */}
          <Form.Item
            label={<span className="font-b5 text-h4 text-blackColor  !font-custom">Password</span>}
            name="password"
            required={false}
            rules={[
              { required: true, message: "Please enter your password" },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])(?!.*\s).{6,128}$/,
                message:
                  "Password must include uppercase, lowercase, number,",
              },
            ]}
          >
            <Input.Password
              size="large"
              placeholder="********"
              style={{ border: "2px solid #DBDBDB" }}
              className="w-[100%] rounded-custom !border !border-grey-500 h-12 hover:border-custom shadow-none"
              prefix={<FiLock className="text-mainColor text-[20px] mr-2" />}
              iconRender={(visible) =>
                visible ? (
                  <EyeTwoTone twoToneColor="#9CCC5A" style={{ fontSize: "24px" }} />
                ) : (
                  <EyeInvisibleOutlined style={{ color: "#9CCC5A", fontSize: "24px" }} />
                )
              }
              onCopy={preventCopyPaste}
              onPaste={preventCopyPaste}
            />
          </Form.Item>

          <div className="text-end mb-3">
            <Link to="/auth/forget-password" className="!text-mainColor text-text1 font-b5"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Forgot the password?
            </Link>
          </div>

          {/* Divider */}
          {/* <Divider className="!text-gray-400 text-[18px]  !font-custom">or continue with</Divider> */}

          {/* Social Buttons */}
          {/* <Row gutter={16} className="mb-6 flex justify-center gap-6">
            <Col>
              <Button
                size="large"
                className="w-[120px] h-[50px] rounded-custom flex items-center justify-center border border-custom"
                onClick={() => message.info("Google login not implemented.")}
              >
                <img src={Google} alt="Google" className="h-6" />
              </Button>
            </Col>
            <Col>
              <Button
                size="large"
                className="w-[120px] h-[50px] rounded-custom flex items-center justify-center border border-custom"
                onClick={() => message.info("Apple login not implemented.")}
              >
                <img src={Apple} alt="Apple" className="h-6" />
              </Button>
            </Col>
          </Row> */}

          {/* Submit Button */}
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ fontFamily: '"Poppins", sans-serif' }}
            className="w-[100%] h-[60px] flex justify-center rounded-custom !bg-mainColor text-whiteColor font-b7 text-h2 border-none  !font-custom"
          >
            Login
          </Button>

          {/* Signup Link */}
          <p className="mt-10 text-center text-text1 text-gray-400 !font-custom"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Don’t have an account?{" "}
            <Link to="/auth/signup" className="!text-mainColor font-b6"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Signup
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default Login;



