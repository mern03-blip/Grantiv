import React, { useState } from "react";
import { Button, Modal, message } from "antd";
import { Delete } from "../../assets/image";
import "./modal.scss"

const DeleteUserModal = ({ open, handleOk, handleCancel }) => {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            // simulate delete API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            handleOk(); // parent se function call
            message.success("User deleted successfully.");
        } catch {
            message.error("Failed to delete user. Please try again.");
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
                <div className="flex gap-5 justify-center m-8" key="footer-buttons">
                    <Button
                        key="cancel"
                        type="primary"
                        onClick={handleCancel}
                        className="!bg-mainColor text-whiteColor font-custom border-custom font-b6"
                    >
                        Cancel
                    </Button>
                    <Button
                        key="ok"
                        type="primary"
                        danger
                        onClick={handleConfirm}
                        loading={loading}
                        className="bg-red-500 hover:!bg-red-600 font-custom font-b6 text-white"
                    >
                        Delete
                    </Button>
                </div>,
            ]}
        >
            <div className="flex flex-col justify-center items-center gap-5 text-center">
                <div className="h-16 w-16">
                    <img src={Delete} alt="delete user" />
                </div>
                <p className="text-text1 font-b6 font-custom">
                    Are you sure you want to delete this user?
                </p>

            </div>
        </Modal>
    );
};

export default DeleteUserModal;
