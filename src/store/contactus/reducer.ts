import { get } from "lodash";
import { useSelector } from "react-redux";

import {
  REQUEST_MASTER_CONTACTUS,
  SET_MASTER_CONTACTUS,
  ERROR_GET_MASTER_CONTACTUS,
  SET_MESSAGE_MASTER_CONTACTUS,
  SUCCESS_UPDATE_MASTER_CONTACTUS,
  REQUEST_UPDATE_MASTER_CONTACTUS,
  ERROR_UPDATE_MASTER_CONTACTUS,
} from "./contactusActionTypes";

interface IState {
  conbusy: boolean;
  message: string;
  masterContact: any[];
}

const initialState: IState = {
  conbusy: false,
  message: "",
  masterContact: [],
};

const contact = (state = initialState, action: Record<string, any>) => {
  switch (action.type) {
    case REQUEST_MASTER_CONTACTUS:
    case REQUEST_UPDATE_MASTER_CONTACTUS:
      return {
        ...state,
        busy: true,
        message: "",
      };

    case SET_MESSAGE_MASTER_CONTACTUS:
      return {
        ...state,
        message: "",
      };

    case SET_MASTER_CONTACTUS:
      return {
        ...state,
        busy: false,
        message: "",
        masterContact: action.payload,
      };

    case SUCCESS_UPDATE_MASTER_CONTACTUS:
      return {
        ...state,
        conbusy: false,
        message: "",
        masterContact: state.masterContact.map((mp) => {
          return get(mp, "_id") === action.payload._id ? action.payload : mp;
        }),
      };

    case ERROR_GET_MASTER_CONTACTUS:
    case ERROR_UPDATE_MASTER_CONTACTUS:
      return {
        ...state,
        conbusy: false,
        message:
          action.payload || "Something happened wrong try again after sometime",
      };
    default:
      return state;
  }
};

export default contact;

export function useContactMaster() {
  return useSelector((state: Record<string, any>) => state.contact);
}
