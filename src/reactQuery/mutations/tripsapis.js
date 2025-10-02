
export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const getFriendlyError = (err) => {
    const status = err?.response?.status;
    const data = err?.response?.data || {};
    const serverMsg = (
      typeof data === "string" ? data : data.message || data.error || ""
    ).toString();
    // Map the backend's generic message to specific UX copy
    if (status === 400) {
      // e.g. server says: "Invalid email or password."
      if (serverMsg.toLowerCase().includes("invalid email or password")) {
        return "Incorrect password. Please try again.";
      }
      return "Incorrect password. Please try again.";
    }
    if (status === 404) {
      return "No account found with that email.";
    }
    if (status === 401 || status === 403) {
      return "Invalid credentials. Please sign in again.";
    }
    if (status === 429) return "Too many attempts. Please wait and try again.";
    if (status === 500) return "Server error. Please try again later.";
    if (err?.message === "Network Error")
      return "Network error. Check your internet connection.";
    return "Login failed. Please try again.";
  };
  const { mutate: login, isPending: isLoading } = useMutation({
    mutationFn: (formData) => userLogin(formData),
    onSuccess: (response) => {
      try {
        if (response?.user?.token) {
          localStorage.setItem("token", response?.user?.token);
           localStorage.setItem("role", response?.user?.role);
          window.dispatchEvent(new Event("token:updated"));
             navigate("/home");
        }
      } catch {}
      message.success("Login Successfully");
      queryClient.invalidateQueries({ queryKey: ["login"] });
      navigate("/home");
    },
    onError: (error) => {
      const msg = getFriendlyError(error);
      message.error(msg);
    },
  });
  return { login, isLoading };
}