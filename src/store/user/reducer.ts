import { get } from "lodash";
import { useSelector } from "react-redux";
import {
  REQUEST_BLOCK_USERS,
  REQUEST_USERS,
  SET_USERS,
  SUCCESS_BLOCK_USERS,
} from "./userActionType";

const initialState = {
  busy: false,
  message: "",
  users: [],
};
const users = (state = initialState, action: Record<string, any>) => {
  switch (action.type) {
    case REQUEST_USERS:
    case REQUEST_BLOCK_USERS:
      return {
        ...state,
        busy: true,
        message: "",
      };
    case SET_USERS:
      return {
        ...state,
        busy: false,
        message: "",
        users: action.payload,
      };

    case SUCCESS_BLOCK_USERS:
      return {
        ...state,
        busy: false,
        message: "",
        users: state.users.map((mg: Record<string, any>) => {
          if (get(mg, "_id") === action.payload._id) {
            return { ...mg, blockedByAdmin: action.payload.blockedByAdmin };
          }
          return mg;
        }),
      };

    default:
      return state;
  }
};
export default users;

export function useUsers() {
  return useSelector((state: Record<string, any>) => state.users);
}
