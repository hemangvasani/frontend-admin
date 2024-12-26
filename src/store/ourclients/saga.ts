import axios from "axios";
import { get } from "lodash";
import { all, call, put, takeLatest } from "redux-saga/effects";
import { REQUEST_UPDATE_MASTER_OUR_CLIENTS_STORY, ERROR_CREATE_MASTER_OUR_CLIENTS_STORY, SUCCESS_UPDATE_MASTER_OUR_CLIENTS_STORY, ERROR_UPDATE_MASTER_OUR_CLIENTS_STORY, SUCCESS_DELETE_MASTER_OUR_CLIENTS_STORY, ERROR_DELETE_MASTER_OUR_CLIENTS_STORY, REQUEST_DELETE_MASTER_OUR_CLIENTS_STORY } from './ourclientssActionTypes';
import {
  REQUEST_MASTER_OUR_CLIENTS,
  REQUEST_CREATE_MASTER_OUR_CLIENTS,
  SET_MASTER_OUR_CLIENTS,
  SUCCESS_CREATE_MASTER_OUR_CLIENTS,
  ERROR_GET_MASTER_OUR_CLIENTS,
  ERROR_CREATE_MASTER_OUR_CLIENTS,
  SUCCESS_UPDATE_MASTER_OUR_CLIENTS,
  ERROR_UPDATE_MASTER_OUR_CLIENTS,
  SUCCESS_DELETE_MASTER_OUR_CLIENTS,
  ERROR_DELETE_MASTER_OUR_CLIENTS,
  REQUEST_UPDATE_MASTER_OUR_CLIENTS,
  REQUEST_DELETE_MASTER_OUR_CLIENTS,
  SUCCESS_CREATE_MASTER_OUR_CLIENTS_STORY,
  REQUEST_CREATE_MASTER_OUR_CLIENTS_STORY,
} from "./ourclientssActionTypes";

function* requestMasterOurClients(action: Record<string, any>): any {
  try {
    const result: any = yield call(getOurClientsMaster);
    yield put({ type: SET_MASTER_OUR_CLIENTS, payload: result.data.data });
    // console.log(result.data);
  } catch (error: any) {
    console.log(error);
    let message =
      "Something went wrong, please try again after some time or Refresh the Page.";
    if (get(error, "response.status") === 500) {
      message = "Something happened wrong try again after sometime.";
    } else if (get(error, "response.status") === 422) {
      message = error.response.data.message || "please provide valid contain";
    } else if (get(error, "response.status") === 415) {
      message = error.response.data.message;
    }
    yield put({ type: ERROR_GET_MASTER_OUR_CLIENTS, payload: message });
  }
}

function* requestUpdateMasterOurClients(action: Record<string, any>): any {
  try {
   
    const result = yield call(
      updateMasterOurClients,
      action.data.payload,
      action.data._id
    );
    yield put({
      type: SUCCESS_UPDATE_MASTER_OUR_CLIENTS,
      payload: result.data.data,
    });
    if (action.onSuccess) action.onSuccess(result);
  } catch (error: any) {
    console.log(error);
    let message =
      "Something went wrong, please try again after some time or Refresh the Page.";
    if (get(error, "response.status") === 500) {
      message = "Something happened wrong try again after sometime.";
    } else if (get(error, "response.status") === 422) {
      message = error.response.data.message || "please provide valid contain";
    } else if (get(error, "response.status") === 415) {
      message = error.response.data.message;
    }
    yield put({ type: ERROR_UPDATE_MASTER_OUR_CLIENTS, payload: message });
  }
}
function* requestUpdateMasterOurClientsStory(action: Record<string, any>): any {
  try {
    console.log(action.data.payload, "action.data.payload");
    
    const result = yield call(
      updateMasterOurClientsStory,
      action.data.payload,
      action.data._id
    );
    yield put({
      type: SUCCESS_UPDATE_MASTER_OUR_CLIENTS_STORY,
      payload: result.data.data,
    });
    if (action.onSuccess) action.onSuccess(result);
  } catch (error: any) {
    console.log(error);
    let message =
      "Something went wrong, please try again after some time or Refresh the Page.";
    if (get(error, "response.status") === 500) {
      message = "Something happened wrong try again after sometime.";
    } else if (get(error, "response.status") === 422) {
      message = error.response.data.message || "please provide valid contain";
    } else if (get(error, "response.status") === 415) {
      message = error.response.data.message;
    }
    yield put({ type: ERROR_UPDATE_MASTER_OUR_CLIENTS_STORY, payload: message });
  }
}

function* requestDeleteMasterOurClients(action: Record<string, any>): any {
  try {
    yield call(deleteMasterOurClients, get(action, "payload._id", ""));
    yield put({
      type: SUCCESS_DELETE_MASTER_OUR_CLIENTS,
      payload: get(action, "payload._id", ""),
    });

  } catch (error: any) {
    let message = error.response?.data?.message || 
  "Something went wrong, please try again after some time or Refresh the Page.";
    if (get(error, "response.status") === 500) {
      message = "Something happened wrong try again after sometime.";
    } else if (get(error, "response.status") === 422) {
      message = "please provide valid contain";
    } else if (get(error, "response.status") === 415) {
      message = error.response.data.message;
    }
    yield put({ type: ERROR_DELETE_MASTER_OUR_CLIENTS, payload: message });
  }
}
function* requestDeleteMasterOurClientsStory(action: Record<string, any>): any {
  try {
    yield call(deleteMasterOurClientsStory, get(action, "payload._id", ""));
    yield put({
      type: SUCCESS_DELETE_MASTER_OUR_CLIENTS_STORY,
      payload: get(action, "payload._id", ""),
    });

  } catch (error: any) {
    let message = error.response?.data?.message || 
  "Something went wrong, please try again after some time or Refresh the Page.";
    if (get(error, "response.status") === 500) {
      message = "Something happened wrong try again after sometime.";
    } else if (get(error, "response.status") === 422) {
      message = "please provide valid contain";
    } else if (get(error, "response.status") === 415) {
      message = error.response.data.message;
    }
    yield put({ type: ERROR_DELETE_MASTER_OUR_CLIENTS_STORY, payload: message });
  }
}

function* requestCreateMasterOurClients(action: Record<string, any>): any {
  try {
    const result = yield call(createMasterOurClients, action.payload);
    
    yield put({
      type: SUCCESS_CREATE_MASTER_OUR_CLIENTS,
      payload: result.data.data,
    });
    console.log(result.data, "result.data");
    if (action.onSuccess) action.onSuccess(result);
    // update relevant category as well
  } catch (error: any) {
    console.log(error);
    let message =
      "Something went wrong, please try again after some time or Refresh the Page.";
    if (get(error, "response.status") === 500) {
      message = "Something happened wrong try again after sometime.";
    } else if (get(error, "response.status") === 422) {
      message = error.response.data.message || "please provide valid contain";
    } else if (get(error, "response.status") === 415) {
      message = error.response.data.message;
    }
    yield put({ type: ERROR_CREATE_MASTER_OUR_CLIENTS, payload: message });
  }
}
function* requestCreateMasterOurClientsStory(action: Record<string, any>): any {
  try {
    const result = yield call(createMasterOurClientsStory, action.payload);
    
    yield put({
      type: SUCCESS_CREATE_MASTER_OUR_CLIENTS_STORY,
      payload: result.data.data,
    });
    if (action.onSuccess) action.onSuccess(result);
    // update relevant category as well
  } catch (error: any) {
    console.log(error);
    let message =
      "Something went wrong, please try again after some time or Refresh the Page.";
    if (get(error, "response.status") === 500) {
      message = "Something happened wrong try again after sometime.";
    } else if (get(error, "response.status") === 422) {
      message = error.response.data.message || "please provide valid contain";
    } else if (get(error, "response.status") === 415) {
      message = error.response.data.message;
    }
    yield put({ type: ERROR_CREATE_MASTER_OUR_CLIENTS_STORY, payload: message });
  }
}

export function getOurClientsMaster() {
  return axios({
    method: "GET",
    url: `${process.env.REACT_APP_BASE_URL}/clients`,
    withCredentials: true,
  });
}

export function createMasterOurClients(payload: Record<string, any>) {
  return axios({
    method: "post",
    url: `${process.env.REACT_APP_BASE_URL}/clients`,
    data: payload,
    withCredentials: true,
  });
}
export function createMasterOurClientsStory(payload: Record<string, any>) {
  return axios({
    method: "post",
    url: `${process.env.REACT_APP_BASE_URL}/client-story`,
    data: payload,
    withCredentials: true,
  });
}

export function deleteMasterOurClients(_id: string) {
  return axios({
    method: "delete",
    url: `${process.env.REACT_APP_BASE_URL}/clients/${_id}`,
    withCredentials: true,
  });
}
export function deleteMasterOurClientsStory(_id: string) {
  return axios({
    method: "delete",
    url: `${process.env.REACT_APP_BASE_URL}/client-story/${_id}`,
    withCredentials: true,
  });
}
export function updateMasterOurClients(
  payload: Record<string, any>,
  _id: string
) {
  return axios({
    method: "patch",
    url: `${process.env.REACT_APP_BASE_URL}/clients/${_id}`,
    data: payload,
    withCredentials: true,
  });
}
export function updateMasterOurClientsStory(
  payload: Record<string, any>,
  _id: string
) {
  return axios({
    method: "patch",
    url: `${process.env.REACT_APP_BASE_URL}/client-story/${_id}`,
    data: payload,
    withCredentials: true,
  });
}

const ourclientsMasterSaga = function* () {
  yield all([
    takeLatest(REQUEST_MASTER_OUR_CLIENTS, requestMasterOurClients),
    takeLatest(REQUEST_CREATE_MASTER_OUR_CLIENTS, requestCreateMasterOurClients),
    takeLatest(REQUEST_CREATE_MASTER_OUR_CLIENTS_STORY, requestCreateMasterOurClientsStory),
    takeLatest(REQUEST_UPDATE_MASTER_OUR_CLIENTS, requestUpdateMasterOurClients),
    takeLatest(REQUEST_UPDATE_MASTER_OUR_CLIENTS_STORY, requestUpdateMasterOurClientsStory),
    takeLatest(REQUEST_DELETE_MASTER_OUR_CLIENTS, requestDeleteMasterOurClients),
    takeLatest(REQUEST_DELETE_MASTER_OUR_CLIENTS_STORY, requestDeleteMasterOurClientsStory),
  ]);
};

export default ourclientsMasterSaga;
