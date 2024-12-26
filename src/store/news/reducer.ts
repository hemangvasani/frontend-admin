import { get } from "lodash";
import { useSelector } from "react-redux";

import {
  REQUEST_MASTER_NEWS,
  REQUEST_CREATE_MASTER_NEWS,
  SET_MASTER_NEWS,
  SUCCESS_CREATE_MASTER_NEWS,
  ERROR_GET_MASTER_NEWS,
  ERROR_CREATE_MASTER_NEWS,
  SET_MESSAGE_MASTER_NEWS,
  SUCCESS_DELETE_MASTER_NEWS,
  SUCCESS_UPDATE_MASTER_NEWS,
  REQUEST_DELETE_MASTER_NEWS,
  REQUEST_UPDATE_MASTER_NEWS,
  ERROR_DELETE_MASTER_NEWS,
  ERROR_UPDATE_MASTER_NEWS,
} from "./newsActionTypes";

interface IState {
  busy: boolean;
  message: string;
  masterNews: any[];
}

const initialState: IState = {
  busy: false,
  message: "",
  masterNews: [],
};

const news = (state = initialState, action: Record<string, any>) => {
  switch (action.type) {
    case REQUEST_MASTER_NEWS:
    case REQUEST_CREATE_MASTER_NEWS:
    case REQUEST_DELETE_MASTER_NEWS:
    case REQUEST_UPDATE_MASTER_NEWS:
      return {
        ...state,
        busy: true,
        message: "",
      };

    case SET_MESSAGE_MASTER_NEWS:
      return {
        ...state,
        message: "",
      };

    case SET_MASTER_NEWS:
      return {
        ...state,
        busy: false,
        message: "",
        masterNews: action.payload,
      };

    case SUCCESS_CREATE_MASTER_NEWS:
    //   console.log(action.payload);
      return {
        ...state,
        busy: false,
        message: "",
        masterNews: [...state.masterNews, action.payload],
      };
    case SUCCESS_DELETE_MASTER_NEWS:
      return {
        ...state,
        busy: false,
        message: "",
        masterNews: state.masterNews.filter(
          (tutorial) => get(tutorial, "_id") !== action.payload
        ),
      };

    case SUCCESS_UPDATE_MASTER_NEWS:
      return {
        ...state,
        busy: false,
        message: "",
        masterNews: state.masterNews.map((mp) => {
          return get(mp, "_id") === action.payload._id ? action.payload : mp;
        }),
      };

    case ERROR_GET_MASTER_NEWS:
    case ERROR_CREATE_MASTER_NEWS:
    case ERROR_UPDATE_MASTER_NEWS:
    case ERROR_DELETE_MASTER_NEWS:
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

export default news;

export function useNewsMaster() {
  return useSelector((state: Record<string, any>) => state.news);
}
