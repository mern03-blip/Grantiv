// import React, { useState, useEffect } from "react";
// import { useSearchParams, useNavigate, useParams } from "react-router-dom";
// import axiosInstance from "../../api/axios/axiosInstance";

// const InvitationPage = () => {
//     const [status, setStatus] = useState("loading"); // loading, error, form, confirm, success
//     const [error, setError] = useState("");
//     const [invitationData, setInvitationData] = useState(null);
//     const [formData, setFormData] = useState({
//         name: "",
//         password: "",
//         confirmPassword: "",
//     });

//     const { token } = useParams();
//     const navigate = useNavigate();
//     // const token = localStorage.getItem("token");

//     // Step 1: Verify invitation token
//     useEffect(() => {
//         if (!token) {
//             setStatus("error");
//             setError("No invitation token provided. Please use the link from your email.");
//             return;
//         }

//         const verifyToken = async () => {
//             try {
//                 const response = await axiosInstance.get(`/invitation/verify/${token}`);
//                 setInvitationData(response.data);

//                 if (response.data.userExists) {
//                     setStatus("confirm");
//                 } else {
//                     setStatus("form");
//                 }
//             } catch (err) {
//                 setStatus("error");
//                 setError(err.response?.data?.message || "This invitation is invalid or has expired.");
//             }
//         };

//         verifyToken();
//     }, [token]);

//     // Handle input changes
//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     // Step 2: Submit form
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError("");
//         setStatus("loading");

//         if (status === "form" && formData.password !== formData.confirmPassword) {
//             setError("Passwords do not match.");
//             setStatus("form");
//             return;
//         }

//         try {
//             const payload = {
//                 token,
//                 ...(status === "form" && {
//                     name: formData.name,
//                     password: formData.password,
//                 }),
//             };

//             await axiosInstance.post("/invitation/accept", payload);
//             setStatus("success");

//             setTimeout(() => navigate("/auth/login"), 3000);
//         } catch (err) {
//             setError(
//                 err.response?.data?.message || "Failed to accept the invitation. Please try again."
//             );
//             setStatus(invitationData?.userExists ? "confirm" : "form");
//         }
//     };

//     // --- Conditional Views ---
//     if (status === "loading") {
//         return (
//             <div className="max-w-md mx-auto mt-20 p-8 text-center border border-gray-200 rounded-lg shadow-md">
//                 <h2 className="text-2xl font-semibold text-gray-700 mb-4">
//                     Verifying Invitation...
//                 </h2>
//                 <p className="text-gray-500">Please wait a moment.</p>
//             </div>
//         );
//     }

//     if (status === "error") {
//         return (
//             <div className="max-w-md mx-auto mt-20 p-8 text-center border border-red-200 bg-red-50 rounded-lg shadow-md">
//                 <h2 className="text-2xl font-semibold text-red-600 mb-3">Oops!</h2>
//                 <p className="text-gray-700">{error}</p>
//             </div>
//         );
//     }

//     if (status === "success") {
//         return (
//             <div className="max-w-md mx-auto mt-20 p-8 text-center border border-green-200 bg-green-50 rounded-lg shadow-md">
//                 <h2 className="text-2xl font-semibold text-green-700 mb-3">
//                     Welcome!
//                 </h2>
//                 <p className="text-gray-700">
//                     You have successfully joined the organization. Redirecting to login
//                     page...
//                 </p>
//             </div>
//         );
//     }

//     return (
//         <div className="max-w-md mx-auto mt-20 p-8 text-center border border-gray-200 rounded-lg shadow-md bg-white">
//             <form onSubmit={handleSubmit} className="flex flex-col text-left">
//                 <h2 className="text-2xl font-semibold text-gray-800 mb-3 text-center">
//                     Accept Invitation
//                 </h2>
//                 <p className="text-gray-600 mb-4 text-center">
//                     You have been invited to join an organization as a member.
//                 </p>

//                 <p className="bg-gray-100 text-gray-800 p-3 rounded-md mb-4 text-center">
//                     Invited Email: <strong>{invitationData?.email}</strong>
//                 </p>

//                 {status === "form" && (
//                     <>
//                         <p className="text-gray-600 mb-4 text-center">
//                             To accept, please create your account below.
//                         </p>

//                         <div className="mb-4">
//                             <label htmlFor="name" className="block font-medium text-gray-700 mb-1">
//                                 Full Name
//                             </label>
//                             <input
//                                 type="text"
//                                 id="name"
//                                 name="name"
//                                 className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                                 value={formData.name}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </div>

//                         <div className="mb-4">
//                             <label htmlFor="password" className="block font-medium text-gray-700 mb-1">
//                                 Password
//                             </label>
//                             <input
//                                 type="password"
//                                 id="password"
//                                 name="password"
//                                 className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                                 value={formData.password}
//                                 onChange={handleChange}
//                                 required
//                                 minLength="6"
//                             />
//                         </div>

//                         <div className="mb-4">
//                             <label
//                                 htmlFor="confirmPassword"
//                                 className="block font-medium text-gray-700 mb-1"
//                             >
//                                 Confirm Password
//                             </label>
//                             <input
//                                 type="password"
//                                 id="confirmPassword"
//                                 name="confirmPassword"
//                                 className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                                 value={formData.confirmPassword}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </div>
//                     </>
//                 )}

//                 {status === "confirm" && (
//                     <p className="text-gray-600 mb-6 text-center">
//                         Since you already have an account, just click below to join.
//                     </p>
//                 )}

//                 {error && (
//                     <p className="text-red-600 bg-red-100 border border-red-300 rounded-md p-3 mb-4 text-center">
//                         {error}
//                     </p>
//                 )}

//                 <button
//                     type="submit"
//                     className="w-full py-3 bg-mainColor text-white font-semibold rounded-md hover:bg-mainColor transition-colors duration-200"
//                 >
//                     {status === "form" ? "Create Account & Join" : "Accept & Join"}
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default InvitationPage;


import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Button, Typography, Alert, Spin, Card } from "antd";
import {
    EyeInvisibleOutlined,
    EyeTwoTone,
} from "@ant-design/icons";
import axiosInstance from "../../api/axios/axiosInstance";

const { Title, Paragraph, Text } = Typography;

const InvitationPage = () => {
    const [status, setStatus] = useState("loading"); // loading, error, form, confirm, success
    const [error, setError] = useState("");
    const [invitationData, setInvitationData] = useState(null);
    const navigate = useNavigate();
    const { token } = useParams();

    const [form] = Form.useForm();

    // Step 1: Verify invitation token
    useEffect(() => {
        if (!token) {
            setStatus("error");
            setError("No invitation token provided. Please use the link from your email.");
            return;
        }

        const verifyToken = async () => {
            try {
                const response = await axiosInstance.get(`/invitation/verify/${token}`);
                setInvitationData(response.data);
                setStatus(response.data.userExists ? "confirm" : "form");
            } catch (err) {
                setStatus("error");
                setError(err.response?.data?.message || "This invitation is invalid or has expired.");
            }
        };

        verifyToken();
    }, [token]);

    // Step 2: Submit form
    const handleSubmit = async (values) => {
        // console.log(values);

        setError("");
        setStatus("loading");

        try {
            const payload = {
                token,
                ...(status === "form" && {
                    name: values.name,
                    password: values.password,
                }),
            };

            await axiosInstance.post("/invitation/accept", payload);
            setStatus("success");

            setTimeout(() => navigate("/auth/login"), 3000);
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to accept the invitation. Please try again."
            );
            setStatus(invitationData?.userExists ? "confirm" : "form");
        }
    };

    // --- Conditional Views ---
    if (status === "loading") {
        return (
            <Card className="max-w-md mx-auto mt-20 text-center shadow-md">
                {/* <Spin size="large" /> */}
                <Title level={3} className="mt-4 text-gray-700">
                    Verifying Invitation...
                </Title>
                <Paragraph>Please wait a moment.</Paragraph>
            </Card>
        );
    }

    if (status === "error") {
        return (
            <Card className="max-w-md mx-auto mt-20 text-center border-red-200 bg-red-50 shadow-md">
                <Alert message="Oops!" description={error} type="error" showIcon />
            </Card>
        );
    }

    if (status === "success") {
        return (
            <Card className="max-w-md mx-auto mt-20 text-center border-green-200 bg-green-50 shadow-md">
                <Alert
                    message="Welcome!"
                    description="You have successfully joined the organization. Redirecting to login page..."
                    type="success"
                    showIcon
                />
            </Card>
        );
    }

    return (
        <Card className="max-w-md mx-auto mt-20 shadow-md bg-white">
            <Title level={3} className="text-center mb-2">
                Accept Invitation
            </Title>
            <Paragraph className="text-center mb-3 text-gray-600">
                You have been invited to join an organization as a member.
            </Paragraph>

            <Alert
                message={
                    <span>
                        Invited Email: <strong>{invitationData?.email}</strong>
                    </span>
                }
                type="info"
                className="mb-4 text-center bg-gray-100 border border-gray-300 text-[18px]"
            />

            {status === "form" && (
                <Paragraph className="text-center mb-5 text-[16px] text-gray-500">
                    To accept, please create your account below.
                </Paragraph>
            )}

            {status === "confirm" && (
                <Paragraph className="text-center mb-6 text-[16px] text-gray-500">
                    Since you already have an account, just click below to join.
                </Paragraph>
            )}

            {error && (
                <Alert message={error} type="error" showIcon className="mb-4 text-center" />
            )}

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{ name: "", password: "", confirmPassword: "" }}
            >
                {status === "form" && (
                    <>
                        <Form.Item
                            name="name"
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
                                // prefix={<img src={User} alt="User Icon" className="mr-2 text-mainColor" />}
                                style={{ border: "1px solid #DBDBDB" }}
                                placeholder="Enter name"
                                size="large"
                                className="h-12 rounded-custom border-custom text-h4 hover:border-custom placeholder-primaryTextColor focus:border-mainColor focus:ring-1 focus:ring-mainColor"
                            />
                        </Form.Item>

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
                                        return Promise.reject(new Error("Passwords do not match!"));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
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
                    </>
                )}

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={status === "loading"}
                        style={{ fontFamily: '"Poppins", sans-serif' }}
                        className="w-[100%] h-[60px] flex justify-center !font-custom rounded-custom !bg-mainColor text-whiteColor font-b7 text-h3 border-none"
                    >
                        {status === "form" ? "Create Account & Join" : "Accept & Join"}
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default InvitationPage;

