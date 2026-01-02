import React, { useState } from "react";
import { Button, Modal, message } from "antd";
import { cancelSubscription } from "../../api/endpoints/payment";
import "./modal.scss";

const SubCancelModal = ({ open, handleOk, handleCancel }) => {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            const res = await cancelSubscription();

            handleOk(); // parent function call

            message.success(
                res?.message || "Subscription cancellation requested successfully."
            );
        } catch (error) {
            console.error("Error cancelling subscription:", error);

            message.error(
                error?.response?.message ||
                "Failed to cancel subscription. Please try again or contact support."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            className="custom"
            open={open}
            onCancel={handleCancel}
            footer={[
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center m-4 sm:m-6 md:m-8" key="footer-buttons">
                    <Button
                        key="cancel"
                        type="primary"
                        onClick={handleCancel}
                        className="!bg-mainColor text-whiteColor font-custom border-custom font-b6 w-full sm:w-auto text-sm sm:text-base"
                    >
                        Keep Subscription
                    </Button>
                    <Button
                        key="ok"
                        type="primary"
                        danger
                        onClick={handleConfirm}
                        loading={loading}
                        className="bg-red-500 hover:!bg-red-600 font-custom font-b6 text-white w-full sm:w-auto text-sm sm:text-base"
                    >
                        {loading ? "Cancelling..." : "Cancel Subscription"}
                    </Button>
                </div>,
            ]}
        >
            <div className="flex flex-col justify-center items-center gap-3 sm:gap-4 md:gap-5 text-center p-2 sm:p-4">
                <div className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 flex items-center justify-center bg-red-100 rounded-full">
                    <svg
                        className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>
                <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 font-custom">
                        Cancel Subscription?
                    </h3>
                    <p className="text-sm sm:text-base text-text1 font-b6 font-custom">
                        Are you sure you want to cancel your subscription?
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 font-custom">
                        This will downgrade your plan to 'Starter' at the end of your current billing cycle.
                    </p>
                </div>
            </div>
        </Modal>
    );
};

export default SubCancelModal;
