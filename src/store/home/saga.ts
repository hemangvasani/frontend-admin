import axios from "axios";
import { get } from "lodash";
import { all, call, put, takeLatest } from "redux-saga/effects";
import {
  REQUEST_MASTER_HOME,
  REQUEST_CREATE_MASTER_HOME,
  SET_MASTER_HOME,
  SUCCESS_CREATE_MASTER_HOME,
  ERROR_GET_MASTER_HOME,
  ERROR_CREATE_MASTER_HOME,
  SUCCESS_DELETE_MASTER_HOME,
  SUCCESS_UPDATE_MASTER_HOME,
  REQUEST_DELETE_MASTER_HOME,
  REQUEST_UPDATE_MASTER_HOME,
  ERROR_DELETE_MASTER_HOME,
  ERROR_UPDATE_MASTER_HOME,
} from "./homeActionTypes";

function* requestMasterHomes(action: Record<string, any>): any {
  try {
    const result: any = yield call(getHomesMaster);
    yield put({ type: SET_MASTER_HOME, payload: result.data.data });
    // console.warn(result.data, "jhuihihi");
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
    yield put({ type: ERROR_GET_MASTER_HOME, payload: message });
  }
}

function* requestUpdateMasterTagHome(action: Record<string, any>): any {
  try {
    const result = yield call(
      updateMasterHomes,
      action.data.payload,
      action.data._id
    );
    yield put({
      type: SUCCESS_UPDATE_MASTER_HOME,
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
    yield put({ type: ERROR_UPDATE_MASTER_HOME, payload: message });
  }
}

function* requestDeleteMasterTagHome(action: Record<string, any>): any {
  try {
    yield call(deleteMasterHomes, get(action, "payload._id", ""));
    yield put({
      type: SUCCESS_DELETE_MASTER_HOME,
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
    yield put({ type: ERROR_DELETE_MASTER_HOME, payload: message });
  }
}

function* requestCreateMasterHomes(action: Record<string, any>): any {
  try {
    const result = yield call(createMasterHomes, action.payload);

    yield put({
      type: SUCCESS_CREATE_MASTER_HOME,
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
    yield put({ type: ERROR_CREATE_MASTER_HOME, payload: message });
  }
}

export function getHomesMaster() {
  return axios({
    method: "GET",
    url: `${process.env.REACT_APP_BASE_URL}/products`,
    withCredentials: true,
  });
}

export function createMasterHomes(payload: Record<string, any>) {
  return axios({
    method: "post",
    url: `${process.env.REACT_APP_BASE_URL}/products`,
    data: payload,
    withCredentials: true,
  });
}

export function deleteMasterHomes(_id: string) {
  return axios({
    method: "delete",
    url: `${process.env.REACT_APP_BASE_URL}/products/${_id}`,
    withCredentials: true,
  });
}
export function updateMasterHomes(payload: Record<string, any>, _id: string) {
  return axios({
    method: "patch",
    url: `${process.env.REACT_APP_BASE_URL}/products/${_id}`,
    data: payload,
    withCredentials: true,
  });
}

const homesMasterSaga = function* () {
  yield all([
    takeLatest(REQUEST_MASTER_HOME, requestMasterHomes),
    takeLatest(REQUEST_CREATE_MASTER_HOME, requestCreateMasterHomes),
    takeLatest(REQUEST_UPDATE_MASTER_HOME, requestUpdateMasterTagHome),
    takeLatest(REQUEST_DELETE_MASTER_HOME, requestDeleteMasterTagHome),
  ]);
};

export default homesMasterSaga;
