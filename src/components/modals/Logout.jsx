import React, { useState } from "react";
import { Button, Modal, message } from "antd";
import { LogoutModal } from "@/src/assets/image";
import "./modal.scss"


const Logout = ({ open, handleOk, handleCancel }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      handleOk();
      message.success("Logged out successfully.");
    } catch {
      message.error("Logout failed. Please try again.");
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
            className="!bg-red-500 hover:!bg-red-600 text-whiteColor font-custom border-custom font-b6 w-full sm:w-auto text-sm sm:text-base"
          >
            Cancel
          </Button>
          <Button
            key="ok"
            type="primary"
            onClick={handleConfirm}
            loading={loading}
            className="!bg-mainColor font-custom font-b6 w-full sm:w-auto text-sm sm:text-base"
          >
            Logout
          </Button>
        </div>
      ]}
    >
      <div className="flex flex-col justify-center items-center gap-3 sm:gap-4 md:gap-5 p-2 sm:p-4">
        <div className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16">
          {/* Replace with your actual logout icon */}
          <img src={LogoutModal} alt="logout" />
        </div>
        <p className="text-sm sm:text-base text-text1 font-b6 font-custom text-center">
          Are you sure you want to logout?
        </p>
      </div>
    </Modal>
  );
};

export default Logout;