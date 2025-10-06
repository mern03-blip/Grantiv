import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { App as AntdApp } from "antd";
// import "antd/dist/reset.css";
import "./index.css";


const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* <AntdApp> */}
        <App />
      {/* </AntdApp> */}
    </QueryClientProvider>
  </React.StrictMode>
);
