import { get } from "lodash";
import { useSelector } from "react-redux";

import {
  REQUEST_MASTER_HOME,
  REQUEST_CREATE_MASTER_HOME,
  SET_MASTER_HOME,
  SUCCESS_CREATE_MASTER_HOME,
  ERROR_GET_MASTER_HOME,
  ERROR_CREATE_MASTER_HOME,
  SET_MESSAGE_MASTER_HOME,
  SUCCESS_DELETE_MASTER_HOME,
  SUCCESS_UPDATE_MASTER_HOME,
  REQUEST_DELETE_MASTER_HOME,
  REQUEST_UPDATE_MASTER_HOME,
  ERROR_DELETE_MASTER_HOME,
  ERROR_UPDATE_MASTER_HOME,
} from "./homeActionTypes";

interface IState {
  busy: boolean;
  message: string;
  masterHome: any[];
}

const initialState: IState = {
  busy: false,
  message: "",
  masterHome: [],
};

const homes = (state = initialState, action: Record<string, any>) => {
  switch (action.type) {
    case REQUEST_MASTER_HOME:
    case REQUEST_CREATE_MASTER_HOME:
    case REQUEST_DELETE_MASTER_HOME:
    case REQUEST_UPDATE_MASTER_HOME:
      return {
        ...state,
        busy: true,
        message: "",
      };

    case SET_MESSAGE_MASTER_HOME:
      return {
        ...state,
        message: "",
      };

    case SET_MASTER_HOME:
      return {
        ...state,
        busy: false,
        message: "",
        masterHome: action.payload,
      };

    case SUCCESS_CREATE_MASTER_HOME:
      console.log(action.payload);
      return {
        ...state,
        busy: false,
        message: "",
        masterHome: [...state.masterHome, action.payload],
      };
    case SUCCESS_DELETE_MASTER_HOME:
      return {
        ...state,
        busy: false,
        message: "",
        masterHome: state.masterHome.filter(
          (tutorial) => get(tutorial, "_id") !== action.payload
        ),
      };

    case SUCCESS_UPDATE_MASTER_HOME:
      return {
        ...state,
        busy: false,
        message: "",
        masterHome: state.masterHome.map((mp) => {
          return get(mp, "_id") === action.payload._id ? action.payload : mp;
        }),
      };

    case ERROR_GET_MASTER_HOME:
    case ERROR_CREATE_MASTER_HOME:
    case ERROR_UPDATE_MASTER_HOME:
    case ERROR_DELETE_MASTER_HOME:
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

export default homes;

export function useHomeMaster() {
  return useSelector((state: Record<string, any>) => state.homes);
}
