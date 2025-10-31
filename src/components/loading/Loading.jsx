// import React from "react";
// import { GrantivLogo } from "../icons/Icons";

// const Loading = () => {
//   return (
//     <div className="flex justify-center items-center h-screen">
//       <GrantivLogo className="h-12 w-auto" />
//     </div>
//   );
// };

// export default Loading;

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
    </div>
  );
};

export default Loader;


