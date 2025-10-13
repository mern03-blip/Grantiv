import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../api/axios/axiosInstance";

const InvitationPage = () => {
    const [status, setStatus] = useState("loading"); // loading, error, form, confirm, success
    const [error, setError] = useState("");
    const [invitationData, setInvitationData] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        password: "",
        confirmPassword: "",
    });

    const { token } = useParams();
    const navigate = useNavigate();
    //   const token =localStorage.getItem("token");

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

                if (response.data.userExists) {
                    setStatus("confirm");
                } else {
                    setStatus("form");
                }
            } catch (err) {
                setStatus("error");
                setError(err.response?.data?.message || "This invitation is invalid or has expired.");
            }
        };

        verifyToken();
    }, [token]);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Step 2: Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setStatus("loading");

        if (status === "form" && formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            setStatus("form");
            return;
        }

        try {
            const payload = {
                token,
                ...(status === "form" && {
                    name: formData.name,
                    password: formData.password,
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
            <div className="max-w-md mx-auto mt-20 p-8 text-center border border-gray-200 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                    Verifying Invitation...
                </h2>
                <p className="text-gray-500">Please wait a moment.</p>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="max-w-md mx-auto mt-20 p-8 text-center border border-red-200 bg-red-50 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-red-600 mb-3">Oops!</h2>
                <p className="text-gray-700">{error}</p>
            </div>
        );
    }

    if (status === "success") {
        return (
            <div className="max-w-md mx-auto mt-20 p-8 text-center border border-green-200 bg-green-50 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-green-700 mb-3">
                    Welcome!
                </h2>
                <p className="text-gray-700">
                    You have successfully joined the organization. Redirecting to login
                    page...
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto mt-20 p-8 text-center border border-gray-200 rounded-lg shadow-md bg-white">
            <form onSubmit={handleSubmit} className="flex flex-col text-left">
                <h2 className="text-2xl font-semibold text-gray-800 mb-3 text-center">
                    Accept Invitation
                </h2>
                <p className="text-gray-600 mb-4 text-center">
                    You have been invited to join an organization as a member.
                </p>

                <p className="bg-gray-100 text-gray-800 p-3 rounded-md mb-4 text-center">
                    Invited Email: <strong>{invitationData?.email}</strong>
                </p>

                {status === "form" && (
                    <>
                        <p className="text-gray-600 mb-4 text-center">
                            To accept, please create your account below.
                        </p>

                        <div className="mb-4">
                            <label htmlFor="name" className="block font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="block font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength="6"
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="confirmPassword"
                                className="block font-medium text-gray-700 mb-1"
                            >
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </>
                )}

                {status === "confirm" && (
                    <p className="text-gray-600 mb-6 text-center">
                        Since you already have an account, just click below to join.
                    </p>
                )}

                {error && (
                    <p className="text-red-600 bg-red-100 border border-red-300 rounded-md p-3 mb-4 text-center">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    className="w-full py-3 bg-mainColor text-white font-semibold rounded-md hover:bg-mainColor transition-colors duration-200"
                >
                    {status === "form" ? "Create Account & Join" : "Accept & Join"}
                </button>
            </form>
        </div>
    );
};

export default InvitationPage;
