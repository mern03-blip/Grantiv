import React from "react";
import { Spin, ConfigProvider } from "antd";

const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <ConfigProvider
        theme={{
          components: {
            Spin: {
              colorPrimary: "#8CC84B",
            },
          },
        }}
      >
        <Spin size="large" />
      </ConfigProvider>
      {/* <p className="mt-4 text-mainColor font-semibold text-lg">Loading...</p> */}
    </div>
  );
};

export default Loader;


