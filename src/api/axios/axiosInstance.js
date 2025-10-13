import axios from "axios";

const axiosInstance = axios.create({

  baseURL: "https://grantiv.uc.r.appspot.com/api"
  // baseURL: "https://jvmtq5h7-5000.asse.devtunnels.ms/api"


});
export default axiosInstance;