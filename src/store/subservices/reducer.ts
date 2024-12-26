import { get } from "lodash";
import { useSelector } from "react-redux";

import {
  REQUEST_MASTER_SUB_SERVICES,
  REQUEST_CREATE_MASTER_SUB_SERVICES,
  SET_MASTER_SUB_SERVICES,
  SUCCESS_CREATE_MASTER_SUB_SERVICES,
  ERROR_GET_MASTER_SUB_SERVICES,
  ERROR_CREATE_MASTER_SUB_SERVICES,
  SET_MESSAGE_MASTER_SUB_SERVICES,
  SUCCESS_DELETE_MASTER_SUB_SERVICES,
  SUCCESS_UPDATE_MASTER_SUB_SERVICES,
  REQUEST_DELETE_MASTER_SUB_SERVICES,
  REQUEST_UPDATE_MASTER_SUB_SERVICES,
  ERROR_DELETE_MASTER_SUB_SERVICES,
  ERROR_UPDATE_MASTER_SUB_SERVICES,
} from "./subservicesActionTypes";
interface SubService {
  _id: string;
  name: string;
  description: string;
  service: any;
}

interface IState {
  busy: boolean;
  message: string;
  masterSubServices: {
    message: string;
    data: any[];
    success: boolean;
  };
}

const initialState: IState = {
  busy: false,
  message: "",
  masterSubServices: {
    message: "",
    data: [],
    success: false,
  },
  // masterSubServices: [],
};

const subservices = (state = initialState, action: Record<string, any>) => {
  switch (action.type) {
    case REQUEST_MASTER_SUB_SERVICES:
    case REQUEST_CREATE_MASTER_SUB_SERVICES:
    case REQUEST_DELETE_MASTER_SUB_SERVICES:
    case REQUEST_UPDATE_MASTER_SUB_SERVICES:
      return {
        ...state,
        busy: true,
        message: "",
      };

    case SET_MESSAGE_MASTER_SUB_SERVICES:
      return {
        ...state,
        message: "",
      };

    case SET_MASTER_SUB_SERVICES:
      return {
        ...state,
        busy: false,
        message: "",
        masterSubServices: action.payload,
      };

    case SUCCESS_CREATE_MASTER_SUB_SERVICES:
      console.log(action.payload);
      return {
        ...state,
        busy: false,
        message: "",
        masterSubServices: {
          ...state.masterSubServices,
          data: [...state.masterSubServices.data, action.payload],
        },
      };
    case SUCCESS_DELETE_MASTER_SUB_SERVICES:
      return {
        ...state,
        busy: false,
        message: "",
        masterSubServices: {
          ...state.masterSubServices,
          data: state.masterSubServices.data.filter(
            (service: any) => service._id !== action.payload
          ),
        },
        // masterSubServices: state.masterSubServices.filter(
        //   (tutorial) => get(tutorial, "_id") !== action.payload
        // ),
      };

    case SUCCESS_UPDATE_MASTER_SUB_SERVICES:
      return {
        ...state,
        busy: false,
        message: "",
        masterSubServices: {
          ...state.masterSubServices,
          data: state.masterSubServices.data.map((mp) => {
            return get(mp, "_id") === action.payload._id ? action.payload : mp;
          }),
        },
      };

    case ERROR_GET_MASTER_SUB_SERVICES:
    case ERROR_CREATE_MASTER_SUB_SERVICES:
    case ERROR_UPDATE_MASTER_SUB_SERVICES:
    case ERROR_DELETE_MASTER_SUB_SERVICES:
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

export default subservices;

export function useSubServicesMaster() {
  return useSelector((state: Record<string, any>) => state.subservices);
}
