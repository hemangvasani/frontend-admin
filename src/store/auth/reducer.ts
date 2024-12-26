import { useSelector } from "react-redux";
import { REQUEST_AUTH, REQUEST_SESSION, SET_USER } from "./authActionType";

const initialState = {
  busy: false,
  message: "",
  user: {},
};

const auth = (state = initialState, action: Record<string, any>) => {
  switch (action.type) {
    case REQUEST_AUTH:
      return {
        ...state,
        busy: true,
      };
    case REQUEST_SESSION:
      return {
        ...state,
        busy: true,
      };

    case SET_USER:
      return {
        ...state,
        busy: false,
        user:action.payload
      };
    default:
      return state;
  }
};

export default auth;
export function useAuth() {
  return useSelector((state:Record<string,any>) => state.auth)
}