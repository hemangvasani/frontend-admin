import { get } from "lodash";
import { useSelector } from "react-redux";

import {
  REQUEST_MASTER_OUR_SERVICES,
  REQUEST_CREATE_MASTER_OUR_SERVICES,
  SET_MASTER_OUR_SERVICES,
  SUCCESS_CREATE_MASTER_OUR_SERVICES,
  ERROR_GET_MASTER_OUR_SERVICES,
  ERROR_CREATE_MASTER_OUR_SERVICES,
  SET_MESSAGE_MASTER_OUR_SERVICES,
  SUCCESS_DELETE_MASTER_OUR_SERVICES,
  SUCCESS_UPDATE_MASTER_OUR_SERVICES,
  REQUEST_DELETE_MASTER_OUR_SERVICES,
  REQUEST_UPDATE_MASTER_OUR_SERVICES,
  ERROR_DELETE_MASTER_OUR_SERVICES,
  ERROR_UPDATE_MASTER_OUR_SERVICES,
} from "./ourservicesActionTypes";

interface IState {
  busy: boolean;
  message: string;
  // masterOurServices: any[];
  masterOurServices: {
    message: string;
    data: any[];
    success: boolean;
  };
}

const initialState: IState = {
  busy: false,
  message: "",
  // masterOurServices: [],
  masterOurServices: {
    message: "",
    data: [],
    success: false
  },
};

const ourservices = (state = initialState, action: Record<string, any>) => {
  switch (action.type) {
    case REQUEST_MASTER_OUR_SERVICES:
    case REQUEST_CREATE_MASTER_OUR_SERVICES:
    case REQUEST_DELETE_MASTER_OUR_SERVICES:
    case REQUEST_UPDATE_MASTER_OUR_SERVICES:
      return {
        ...state,
        busy: true,
        message: "",
      };

    case SET_MESSAGE_MASTER_OUR_SERVICES:
      return {
        ...state,
        message: "",
      };

    case SET_MASTER_OUR_SERVICES:
      return {
        ...state,
        busy: false,
        message: "",
        masterOurServices: action.payload,
      };

    case SUCCESS_CREATE_MASTER_OUR_SERVICES:
      console.log(action.payload);
      return {
        ...state,
        busy: false,
        message: "",
        // masterOurServices: [...state.masterOurServices, action.payload],
        masterOurServices: {
          ...state.masterOurServices,
          data: [...state.masterOurServices.data, action.payload],
        },
      };
    case SUCCESS_DELETE_MASTER_OUR_SERVICES:
      return {
        ...state,
        busy: false,
        message: "",
        // masterOurServices: state.masterOurServices.filter(
        //   (tutorial) => get(tutorial, "_id") !== action.payload
        // ),
        masterOurServices: {
          ...state.masterOurServices,
          data: state.masterOurServices.data.filter(
            (service: any) => service._id !== action.payload
          )
        },
      };

    case SUCCESS_UPDATE_MASTER_OUR_SERVICES:
      return {
        ...state,
        busy: false,
        message: "",
        // masterOurServices: state.masterOurServices.map((mp) => {
        //   return get(mp, "_id") === action.payload._id ? action.payload : mp;
        // }),
        masterOurServices: {
          ...state.masterOurServices,
          data: state.masterOurServices.data.map((mp) => {
            return get(mp, "_id") === action.payload._id ? action.payload : mp;
          }),
        },
      };

    case ERROR_GET_MASTER_OUR_SERVICES:
    case ERROR_CREATE_MASTER_OUR_SERVICES:
    case ERROR_UPDATE_MASTER_OUR_SERVICES:
    case ERROR_DELETE_MASTER_OUR_SERVICES:
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

export default ourservices;

export function useOurServicesMaster() {
  return useSelector((state: Record<string, any>) => state.ourservices);
}
