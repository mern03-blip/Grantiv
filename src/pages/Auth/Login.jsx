import React from "react";
import {
  Button,
  Form,
  Input,
  message,
  Typography,
} from "antd";
import { FiMail, FiLock } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";
import { userLogin } from "../../api/endpoints/auth";
import { getSubscriptionStatus } from "../../api/endpoints/payment";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ✅ TanStack Mutation for Login API
  const { mutate: handleLogin, isPending: loading } = useMutation({
    mutationFn: async ({ email, password }) => {
      const response = await userLogin({ email, password });
      return response;
    },
    onSuccess: async (response) => {
      console.log("Login", response);

      if (response?.token) {
        const organizations = response.organizations;

        queryClient.removeQueries(["ai-recommended-grants"]);
        localStorage.setItem("token", response.token);
        localStorage.setItem("userId", response.id);
        
        // If user has organizations, set the first one as default and fetch subscription
        if (organizations && organizations.length > 0) {
          localStorage.setItem("orgId", organizations[0].id);
          
          try {
            // Fetch subscription status after setting orgId
            const subscriptionData = await getSubscriptionStatus();
            if (subscriptionData?.plan) {
              // console.log("Subscription plan stored:", subscriptionData.plan);
            }
          } catch (error) {
            console.error("Error fetching subscription status:", error);
            // Don't block login flow if subscription fetch fails
          }
        }
        
        // const role = response?.organizations?.[0]?.role || null;
        // if (role) {
        //   localStorage.setItem("Role", role);
        // }
        message.success(response.message || "Login successful");
        navigate("/organization-page", {
          state: {
            organizations: organizations,
          },
        });
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
    <div className="w-full min-h-screen flex items-center justify-center !font-custom px-4 sm:px-6">
      <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[90%] p-4 sm:p-6 md:p-8">
        {/* Heading */}
        <Title
          level={3}
          className="!m-0 !text-xl sm:!text-2xl md:!text-text3 lg:!text-3xl !font-b6 text-blackColor !font-custom"
          style={{ fontFamily: '"Poppins", sans-serif' }}
        >
          Login
        </Title>
        <p
          className="text-sm sm:text-base md:text-h3 text-blackColor font-b5 mt-1 sm:mt-2"
          style={{ fontFamily: '"Poppins", sans-serif' }}
        >
          Enter your details to get access.
        </p>

        <Form
          layout="vertical"
          onFinish={onFinish}
          validateTrigger="onChange"
          className="mt-4 sm:mt-6"
        >
          {/* Email Field */}
          <Form.Item
            label={
              <span className="font-b5 text-sm sm:text-base md:text-h4 text-blackColor !font-custom">
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
              style={{ border: "2px solid #DBDBDB" }}
              className="w-[100%] rounded-custom !border !border-grey-500 h-10 sm:h-11 md:h-12 hover:border-custom text-sm sm:text-base"
              prefix={<FiMail className="text-mainColor text-base sm:text-lg mr-1 sm:mr-2" />}
            />
          </Form.Item>

          {/* Password Field */}
          <Form.Item
            label={
              <span className="font-b5 text-sm sm:text-base md:text-h4 text-blackColor  !font-custom">
                Password
              </span>
            }
            name="password"
            required={false}
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              size="large"
              placeholder="********"
              style={{ border: "2px solid #DBDBDB" }}
              className="w-[100%] rounded-custom !border !border-grey-500 h-10 sm:h-11 md:h-12 hover:border-custom shadow-none text-sm sm:text-base"
              prefix={<FiLock className="text-mainColor text-base sm:text-lg md:text-[20px] mr-1 sm:mr-2" />}
              iconRender={(visible) =>
                visible ? (
                  <EyeTwoTone
                    twoToneColor="#9CCC5A"
                    style={{ fontSize: window.innerWidth < 640 ? "20px" : "24px" }}
                  />
                ) : (
                  <EyeInvisibleOutlined
                    style={{ color: "#9CCC5A", fontSize: window.innerWidth < 640 ? "20px" : "24px" }}
                  />
                )
              }
              onCopy={preventCopyPaste}
              onPaste={preventCopyPaste}
            />
          </Form.Item>

          <div className="text-end mb-2 sm:mb-3">
            <Link
              to="/auth/forget-password"
              className="!text-mainColor text-xs sm:text-sm md:text-text1 font-b5"
              style={{ fontFamily: '"Poppins", sans-serif' }}
            >
              Forgot the password?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ fontFamily: '"Poppins", sans-serif' }}
            className="w-[100%] h-12 sm:h-14 md:h-[60px] flex justify-center rounded-custom !bg-mainColor text-whiteColor font-b7 text-base sm:text-lg md:text-h2 border-none  !font-custom"
          >
            Login
          </Button>

          {/* Signup Link */}
          <p
            className="mt-6 sm:mt-8 md:mt-10 text-center text-xs sm:text-sm md:text-text1 text-gray-400 !font-custom"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Don’t have an account?{" "}
            <Link
              to="/auth/signup"
              className="!text-mainColor font-b6"
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
