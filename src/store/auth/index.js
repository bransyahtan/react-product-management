import authReducer, { logoutUser, clearError } from "./authSlice";
import { loginUser } from "./authThunk";

export { loginUser, logoutUser, clearError };
export default authReducer;
