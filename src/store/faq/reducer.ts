import { get } from "lodash";
import { useSelector } from "react-redux";

import {
  REQUEST_MASTER_FAQS,
  REQUEST_CREATE_MASTER_FAQS,
  SET_MASTER_FAQS,
  SUCCESS_CREATE_MASTER_FAQS,
  ERROR_GET_MASTER_FAQS,
  ERROR_CREATE_MASTER_FAQS,
  SET_MESSAGE_MASTER_FAQS,
  SUCCESS_DELETE_MASTER_FAQS,
  SUCCESS_UPDATE_MASTER_FAQS,
  REQUEST_DELETE_MASTER_FAQS,
  REQUEST_UPDATE_MASTER_FAQS,
  ERROR_DELETE_MASTER_FAQS,
  ERROR_UPDATE_MASTER_FAQS,
  REQUEST_MASTER_FAQS_CATEGORIES,
  SET_MASTER_FAQS_CATEGORIES,
  ERROR_GET_MASTER_FAQS_CATEGORIES,
} from "./faqActionTypes";

interface IState {
  busy: boolean;
  message: string;
  masterFaqs: any[];
  masterFaqsCat: any[];
}

const initialState: IState = {
  busy: false,
  message: "",
  masterFaqs: [],
  masterFaqsCat: [],
};

const faqs = (state = initialState, action: Record<string, any>) => {
  switch (action.type) {
    case REQUEST_MASTER_FAQS:
    case REQUEST_MASTER_FAQS_CATEGORIES:
    case REQUEST_CREATE_MASTER_FAQS:
    case REQUEST_DELETE_MASTER_FAQS:
    case REQUEST_UPDATE_MASTER_FAQS:
      return {
        ...state,
        busy: true,
        message: "",
      };

    case SET_MESSAGE_MASTER_FAQS:
      return {
        ...state,
        message: "",
      };

    case SET_MASTER_FAQS:
      return {
        ...state,
        busy: false,
        message: "",
        masterFaqs: action.payload,
      };

      case SET_MASTER_FAQS_CATEGORIES:
      return {
        ...state,
        busy: false,
        message: "",
        masterFaqsCat: action.payload,
      };

    case SUCCESS_CREATE_MASTER_FAQS:
      // console.log(action.payload);
      return {
        ...state,
        busy: false,
        message: "",
        masterFaqs: [...state.masterFaqs, action.payload],
      };
    case SUCCESS_DELETE_MASTER_FAQS:
      return {
        ...state,
        busy: false,
        message: "",
        masterFaqs: state.masterFaqs.filter(
          (tutorial) => get(tutorial, "_id") !== action.payload
        ),
      };

    case SUCCESS_UPDATE_MASTER_FAQS:
      return {
        ...state,
        busy: false,
        message: "",
        masterFaqs: state.masterFaqs.map((mp) => {
          return get(mp, "_id") === action.payload._id ? action.payload : mp;
        }),
      };

    case ERROR_GET_MASTER_FAQS:
    case ERROR_CREATE_MASTER_FAQS:
    case ERROR_UPDATE_MASTER_FAQS:
    case ERROR_DELETE_MASTER_FAQS:
      case ERROR_GET_MASTER_FAQS_CATEGORIES:
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

export default faqs;

export function useFaqsMaster() {
  return useSelector((state: Record<string, any>) => state.faqs);
}
