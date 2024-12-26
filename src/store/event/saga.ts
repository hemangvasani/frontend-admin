import axios from "axios";
import { get } from "lodash";
import { all, call, put, takeLatest } from "redux-saga/effects";
import {
  REQUEST_MASTER_EVENT,
  REQUEST_CREATE_MASTER_EVENT,
  SET_MASTER_EVENT,
  SUCCESS_CREATE_MASTER_EVENT,
  ERROR_GET_MASTER_EVENT,
  ERROR_CREATE_MASTER_EVENT,
  SUCCESS_UPDATE_MASTER_EVENT,
  ERROR_UPDATE_MASTER_EVENT,
  SUCCESS_DELETE_MASTER_EVENT,
  ERROR_DELETE_MASTER_EVENT,
  REQUEST_UPDATE_MASTER_EVENT,
  REQUEST_DELETE_MASTER_EVENT,
} from "./eventActionTypes";

function* requestMasterEvents(action: Record<string, any>): any {
  try {
    const result: any = yield call(getEventsMaster);
    yield put({ type: SET_MASTER_EVENT, payload: result.data });
    // console.warn(result.data);
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
    yield put({ type: ERROR_GET_MASTER_EVENT, payload: message });
  }
}

function* requestUpdateMasterEvents(action: Record<string, any>): any {
  try {
    const result = yield call(
      updateMasterEvents,
      action.data.payload,
      action.data._id
    );
    yield put({
      type: SUCCESS_UPDATE_MASTER_EVENT,
      payload: result.data,
    });
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
    yield put({ type: ERROR_UPDATE_MASTER_EVENT, payload: message });
  }
}

function* requestDeleteMasterEvents(action: Record<string, any>): any {
  try {
    yield call(deleteMasterEvents, get(action, "payload._id", ""));
    yield put({
      type: SUCCESS_DELETE_MASTER_EVENT,
      payload: get(action, "payload._id", ""),
    });
  } catch (error: any) {
    let message =
      "Something went wrong, please try again after some time or Refresh the Page.";
    if (get(error, "response.status") === 500) {
      message = "Something happened wrong try again after sometime.";
    } else if (get(error, "response.status") === 422) {
      message = "please provide valid contain";
    } else if (get(error, "response.status") === 415) {
      message = error.response.data.message;
    }
    yield put({ type: ERROR_DELETE_MASTER_EVENT, payload: message });
  }
}

function* requestCreateMasterEvents(action: Record<string, any>): any {
  

  try {
    const result = yield call(createMasterEvents, action.payload);
    
    yield put({
      type: SUCCESS_CREATE_MASTER_EVENT,
      payload: result.data,
    });
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
    yield put({ type: ERROR_CREATE_MASTER_EVENT, payload: message });
  }
}

export function getEventsMaster() {
  return axios({
    method: "GET",
    url: `${process.env.REACT_APP_BASE_URL}/admin/event`,
    withCredentials: true,
  });
}

export function createMasterEvents(payload: Record<string, any>) {
  return axios({
    method: "post",
    url: `${process.env.REACT_APP_BASE_URL}/admin/event`,
    data: payload,
    withCredentials: true,
  });
}

export function deleteMasterEvents(_id: string) {
  return axios({
    method: "delete",
    url: `${process.env.REACT_APP_BASE_URL}/admin/event/${_id}`,
    withCredentials: true,
  });
}
export function updateMasterEvents(
  payload: Record<string, any>,
  _id: string
) {
  return axios({
    method: "patch",
    url: `${process.env.REACT_APP_BASE_URL}/admin/event/${_id}`,
    data: payload,
    withCredentials: true,
  });
}

const eventsMasterSaga = function* () {
  yield all([
    takeLatest(REQUEST_MASTER_EVENT, requestMasterEvents),
    takeLatest(REQUEST_CREATE_MASTER_EVENT, requestCreateMasterEvents),
    takeLatest(REQUEST_UPDATE_MASTER_EVENT, requestUpdateMasterEvents),
    takeLatest(REQUEST_DELETE_MASTER_EVENT, requestDeleteMasterEvents),
  ]);
};

export default eventsMasterSaga;
