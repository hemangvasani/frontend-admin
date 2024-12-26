import { get } from "lodash";
import { useSelector } from "react-redux";

import {
  REQUEST_MASTER_EVENT,
  REQUEST_CREATE_MASTER_EVENT,
  SET_MASTER_EVENT,
  SUCCESS_CREATE_MASTER_EVENT,
  ERROR_GET_MASTER_EVENT,
  ERROR_CREATE_MASTER_EVENT,
  SET_MESSAGE_MASTER_EVENT,
  SUCCESS_DELETE_MASTER_EVENT,
  SUCCESS_UPDATE_MASTER_EVENT,
  REQUEST_DELETE_MASTER_EVENT,
  REQUEST_UPDATE_MASTER_EVENT,
  ERROR_DELETE_MASTER_EVENT,
  ERROR_UPDATE_MASTER_EVENT,
} from "./eventActionTypes";

interface IState {
  busy: boolean;
  message: string;
  masterEvent: any[];
}

const initialState: IState = {
  busy: false,
  message: "",
  masterEvent: [],
};

const events = (state = initialState, action: Record<string, any>) => {
  switch (action.type) {
    case REQUEST_MASTER_EVENT:
    case REQUEST_CREATE_MASTER_EVENT:
    case REQUEST_DELETE_MASTER_EVENT:
    case REQUEST_UPDATE_MASTER_EVENT:
      return {
        ...state,
        busy: true,
        message: "",
      };

    case SET_MESSAGE_MASTER_EVENT:
      return {
        ...state,
        message: "",
      };

    case SET_MASTER_EVENT:
      return {
        ...state,
        busy: false,
        message: "",
        masterEvent: action.payload,
      };

    case SUCCESS_CREATE_MASTER_EVENT:
      console.log(action.payload);
      return {
        ...state,
        busy: false,
        message: "",
        masterEvent: [...state.masterEvent, action.payload],
      };
    case SUCCESS_DELETE_MASTER_EVENT:
      return {
        ...state,
        busy: false,
        message: "",
        masterEvent: state.masterEvent.filter(
          (tutorial) => get(tutorial, "_id") !== action.payload
        ),
      };

    case SUCCESS_UPDATE_MASTER_EVENT:
      return {
        ...state,
        busy: false,
        message: "",
        masterEvent: state.masterEvent.map((mp) => {
          return get(mp, "_id") === action.payload._id ? action.payload : mp;
        }),
      };

    case ERROR_GET_MASTER_EVENT:
    case ERROR_CREATE_MASTER_EVENT:
    case ERROR_UPDATE_MASTER_EVENT:
    case ERROR_DELETE_MASTER_EVENT:
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

export default events;

export function useEventMaster() {
  return useSelector((state: Record<string, any>) => state.events);
}
