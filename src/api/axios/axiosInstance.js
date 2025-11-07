import axios from "axios";

const axiosInstance = axios.create({

  baseURL: "https://grantiv.uc.r.appspot.com/api"

});
export default axiosInstance;