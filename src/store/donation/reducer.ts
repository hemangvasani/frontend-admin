import { get } from "lodash";
import { useSelector } from "react-redux";
import {
  ERROR_DONATION,
  REQUEST_DONATION,
  SET_DONATION,
} from "./donationActionTypes";

const initialState = {
  busy: false,
  message: "",
  masterDonation: [],
};
const donations = (state = initialState, action: Record<string, any>) => {
  switch (action.type) {
    case REQUEST_DONATION:
      return {
        ...state,
        busy: true,
        message: "",
      };
    case SET_DONATION:
      return {
        ...state,
        busy: false,
        message: "",
        masterDonation: action.payload,
      };
    case ERROR_DONATION:
      return {
        ...state,
        busy: false,
        message:
          action.payload || "Something happened wrong try again after sometime",
      };

    default:
      return state;
  }
};
export default donations;

export function useDonation() {
  return useSelector((state: Record<string, any>) => state.donations);
}
