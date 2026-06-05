import profileReducer, { clearProfile } from "./profileSlice";
import { fetchProfile } from "./profileThunk";

export { fetchProfile, clearProfile };
export default profileReducer;
