import axios from "axios";

const axiosClient = axios.create({

  baseURL: "https://grantiv.uc.r.appspot.com/api"

});
export default axiosClient;