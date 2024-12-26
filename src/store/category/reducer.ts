import { get } from "lodash";
import { useSelector } from "react-redux";

import {
  REQUEST_MASTER_CATEGORIES,
  REQUEST_CREATE_MASTER_CATEGORIES,
  SET_MASTER_CATEGORIES,
  SUCCESS_CREATE_MASTER_CATEGORIES,
  ERROR_GET_MASTER_CATEGORIES,
  ERROR_CREATE_MASTER_CATEGORIES,
  SET_MESSAGE_MASTER_CATEGORIES,
  SUCCESS_DELETE_MASTER_CATEGORIES,
  SUCCESS_UPDATE_MASTER_CATEGORIES,
  REQUEST_DELETE_MASTER_CATEGORIES,
  REQUEST_UPDATE_MASTER_CATEGORIES,
  ERROR_DELETE_MASTER_CATEGORIES,
  ERROR_UPDATE_MASTER_CATEGORIES,
} from "./categoryActionTypes";

interface IState {
  busy: boolean;
  message: string;
  masterCategory: any[];
}

const initialState: IState = {
  busy: false,
  message: "",
  masterCategory: [],
};

const categories = (state = initialState, action: Record<string, any>) => {
  switch (action.type) {
    case REQUEST_MASTER_CATEGORIES:
    case REQUEST_CREATE_MASTER_CATEGORIES:
    case REQUEST_DELETE_MASTER_CATEGORIES:
    case REQUEST_UPDATE_MASTER_CATEGORIES:
      return {
        ...state,
        busy: true,
        message: "",
      };

    case SET_MESSAGE_MASTER_CATEGORIES:
      return {
        ...state,
        message: "",
      };

    case SET_MASTER_CATEGORIES:
      return {
        ...state,
        busy: false,
        message: "",
        masterCategory: action.payload,
      };

    case SUCCESS_CREATE_MASTER_CATEGORIES:
      console.log(action.payload);
      return {
        ...state,
        busy: false,
        message: "",
        masterCategory: [...state.masterCategory, action.payload],
      };
    case SUCCESS_DELETE_MASTER_CATEGORIES:
      return {
        ...state,
        busy: false,
        message: "",
        masterCategory: state.masterCategory.filter(
          (tutorial) => get(tutorial, "_id") !== action.payload
        ),
      };

    case SUCCESS_UPDATE_MASTER_CATEGORIES:
      return {
        ...state,
        busy: false,
        message: "",
        masterCategory: state.masterCategory.map((mp) => {
          return get(mp, "_id") === action.payload._id ? action.payload : mp;
        }),
      };

    case ERROR_GET_MASTER_CATEGORIES:
    case ERROR_CREATE_MASTER_CATEGORIES:
    case ERROR_UPDATE_MASTER_CATEGORIES:
    case ERROR_DELETE_MASTER_CATEGORIES:
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

export default categories;

export function useCategoriesMaster() {
  return useSelector((state: Record<string, any>) => state.categories);
}
