import { get } from "lodash";
import { useSelector } from "react-redux";

import {
  REQUEST_MASTER_OUR_CLIENTS,
  REQUEST_CREATE_MASTER_OUR_CLIENTS,
  SET_MASTER_OUR_CLIENTS,
  SUCCESS_CREATE_MASTER_OUR_CLIENTS,
  ERROR_GET_MASTER_OUR_CLIENTS,
  ERROR_CREATE_MASTER_OUR_CLIENTS,
  SET_MESSAGE_MASTER_OUR_CLIENTS,
  SUCCESS_DELETE_MASTER_OUR_CLIENTS,
  SUCCESS_UPDATE_MASTER_OUR_CLIENTS,
  REQUEST_DELETE_MASTER_OUR_CLIENTS,
  REQUEST_UPDATE_MASTER_OUR_CLIENTS,
  ERROR_DELETE_MASTER_OUR_CLIENTS,
  ERROR_UPDATE_MASTER_OUR_CLIENTS,
  SUCCESS_CREATE_MASTER_OUR_CLIENTS_STORY, REQUEST_CREATE_MASTER_OUR_CLIENTS_STORY, REQUEST_UPDATE_MASTER_OUR_CLIENTS_STORY, SUCCESS_UPDATE_MASTER_OUR_CLIENTS_STORY, ERROR_CREATE_MASTER_OUR_CLIENTS_STORY, ERROR_UPDATE_MASTER_OUR_CLIENTS_STORY, ERROR_DELETE_MASTER_OUR_CLIENTS_STORY, SUCCESS_DELETE_MASTER_OUR_CLIENTS_STORY, REQUEST_DELETE_MASTER_OUR_CLIENTS_STORY
} from "./ourclientssActionTypes";
interface SubService {
  _id: string;
  name: string;
  description: string;
  service: any;
}

interface IState {
  busy: boolean;
  message: string;
  // masterOurClients: {
  //   message: string;
  //   data: any[];
  //   success: boolean;
  // };
  masterOurClients: any[]
}

const initialState: IState = {
  busy: false,
  message: "",
  // masterOurClients: {
  //   message: "",
  //   data: [],
  //   success: false
  // },
  masterOurClients: [],
};

const ourclients = (state = initialState, action: Record<string, any>) => {
  switch (action.type) {
    case REQUEST_MASTER_OUR_CLIENTS:
    case REQUEST_CREATE_MASTER_OUR_CLIENTS:
    case REQUEST_CREATE_MASTER_OUR_CLIENTS_STORY:
    case REQUEST_DELETE_MASTER_OUR_CLIENTS:
    case REQUEST_DELETE_MASTER_OUR_CLIENTS_STORY:
    case REQUEST_UPDATE_MASTER_OUR_CLIENTS:
    case REQUEST_UPDATE_MASTER_OUR_CLIENTS_STORY:
      return {
        ...state,
        busy: true,
        message: "",
      };

    case SET_MESSAGE_MASTER_OUR_CLIENTS:
      return {
        ...state,
        message: "",
      };

    case SET_MASTER_OUR_CLIENTS:
      return {
        ...state,
        busy: false,
        message: "",
        masterOurClients: action.payload,
      };

    case SUCCESS_CREATE_MASTER_OUR_CLIENTS:
      console.log(action.payload);
      return {
        ...state,
        busy: false,
        message: "",
        // masterOurClients: {
        //   ...state.masterOurClients,
        //   data: [...state.masterOurClients.data, action.payload],
        // },
        masterOurClients:  [...state.masterOurClients, action.payload],
      
      };
    case SUCCESS_CREATE_MASTER_OUR_CLIENTS_STORY:
      console.log(action.payload);
      return {
        ...state,
        busy: false,
        message: "",
        // masterOurClients: {
        //   ...state.masterOurClients,
        //   data: [...state.masterOurClients.data, action.payload],
        // },
        masterOurClients:  [...state.masterOurClients, action.payload],
      
      };
    case SUCCESS_DELETE_MASTER_OUR_CLIENTS:
      return {
        ...state,
        busy: false,
        message: "",
        // masterOurClients: {
        //   ...state.masterOurClients,
        //   data: state.masterOurClients.data.filter(
        //     (service: any) => service._id !== action.payload
        //   )
        // },
        masterOurClients: state.masterOurClients.filter(
          (tutorial) => get(tutorial, "_id") !== action.payload
        ),
      };
    case SUCCESS_DELETE_MASTER_OUR_CLIENTS_STORY:
      return {
        ...state,
        busy: false,
        message: "",
        // masterOurClients: {
        //   ...state.masterOurClients,
        //   data: state.masterOurClients.data.filter(
        //     (service: any) => service._id !== action.payload
        //   )
        // },
        masterOurClients: state.masterOurClients.filter(
          (tutorial) => get(tutorial, "_id") !== action.payload
        ),
      };

    case SUCCESS_UPDATE_MASTER_OUR_CLIENTS:
      return {
        ...state,
        busy: false,
        message: "",
        // masterOurClients: {
        //   ...state.masterOurClients,
        //   data: state.masterOurClients.data.map((mp) => {
        //     return get(mp, "_id") === action.payload._id ? action.payload : mp;
        //   }),
        // },
        masterOurClients: state.masterOurClients.map((mp) => {
            return get(mp, "_id") === action.payload._id ? action.payload : mp;
          }),
        
      };
    case SUCCESS_UPDATE_MASTER_OUR_CLIENTS_STORY:
      return {
        ...state,
        busy: false,
        message: "",
        // masterOurClients: {
        //   ...state.masterOurClients,
        //   data: state.masterOurClients.data.map((mp) => {
        //     return get(mp, "_id") === action.payload._id ? action.payload : mp;
        //   }),
        // },
        masterOurClients: state.masterOurClients.map((mp) => {
            return get(mp, "_id") === action.payload._id ? action.payload : mp;
          }),
        
      };

    case ERROR_GET_MASTER_OUR_CLIENTS:
    case ERROR_CREATE_MASTER_OUR_CLIENTS:
    case ERROR_CREATE_MASTER_OUR_CLIENTS_STORY:
    case ERROR_UPDATE_MASTER_OUR_CLIENTS:
    case ERROR_UPDATE_MASTER_OUR_CLIENTS_STORY:
    case ERROR_DELETE_MASTER_OUR_CLIENTS:
    case ERROR_DELETE_MASTER_OUR_CLIENTS_STORY:
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

export default ourclients;

export function useOurClientsMaster() {
  return useSelector((state: Record<string, any>) => state.ourclients);

}
