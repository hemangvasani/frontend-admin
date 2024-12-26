import axios from "axios";
import { get } from "lodash";
import { all, call, put, takeLatest } from "redux-saga/effects";
import {
  REQUEST_MASTER_SUB_SERVICES,
  REQUEST_CREATE_MASTER_SUB_SERVICES,
  SET_MASTER_SUB_SERVICES,
  SUCCESS_CREATE_MASTER_SUB_SERVICES,
  ERROR_GET_MASTER_SUB_SERVICES,
  ERROR_CREATE_MASTER_SUB_SERVICES,
  SUCCESS_UPDATE_MASTER_SUB_SERVICES,
  ERROR_UPDATE_MASTER_SUB_SERVICES,
  SUCCESS_DELETE_MASTER_SUB_SERVICES,
  ERROR_DELETE_MASTER_SUB_SERVICES,
  REQUEST_UPDATE_MASTER_SUB_SERVICES,
  REQUEST_DELETE_MASTER_SUB_SERVICES,
} from "./subservicesActionTypes";

function* requestMasterSubServices(action: Record<string, any>): any {
  try {
    const result: any = yield call(getSubServicesMaster);
    yield put({ type: SET_MASTER_SUB_SERVICES, payload: result.data });
    console.log(result.data);
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
    yield put({ type: ERROR_GET_MASTER_SUB_SERVICES, payload: message });
  }
}

function* requestUpdateMasterSubServices(action: Record<string, any>): any {
  try {
    const result = yield call(
      updateMasterSubServices,
      action.data.payload,
      action.data._id
    );
    yield put({
      type: SUCCESS_UPDATE_MASTER_SUB_SERVICES,
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
    yield put({ type: ERROR_UPDATE_MASTER_SUB_SERVICES, payload: message });
  }
}

function* requestDeleteMasterSubServices(action: Record<string, any>): any {
  try {
    yield call(deleteMasterSubServices, get(action, "payload._id", ""));
    yield put({
      type: SUCCESS_DELETE_MASTER_SUB_SERVICES,
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
    yield put({ type: ERROR_DELETE_MASTER_SUB_SERVICES, payload: message });
  }
}

function* requestCreateMasterSubServices(action: Record<string, any>): any {
  try {
    const result = yield call(createMasterSubServices, action.payload);
    
    yield put({
      type: SUCCESS_CREATE_MASTER_SUB_SERVICES,
      payload: result.data,
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
    yield put({ type: ERROR_CREATE_MASTER_SUB_SERVICES, payload: message });
  }
}

export function getSubServicesMaster() {
  return axios({
    method: "GET",
    url: `${process.env.REACT_APP_BASE_URL}/services/sub`,
    withCredentials: true,
  });
}

export function createMasterSubServices(payload: Record<string, any>) {
  return axios({
    method: "post",
    url: `${process.env.REACT_APP_BASE_URL}/services/sub`,
    data: payload,
    withCredentials: true,
  });
}

export function deleteMasterSubServices(_id: string) {
  return axios({
    method: "delete",
    url: `${process.env.REACT_APP_BASE_URL}/services/sub/${_id}`,
    withCredentials: true,
  });
}
export function updateMasterSubServices(
  payload: Record<string, any>,
  _id: string
) {
  return axios({
    method: "patch",
    url: `${process.env.REACT_APP_BASE_URL}/services/sub/${_id}`,
    data: payload,
    withCredentials: true,
  });
}

const subservicesMasterSaga = function* () {
  yield all([
    takeLatest(REQUEST_MASTER_SUB_SERVICES, requestMasterSubServices),
    takeLatest(REQUEST_CREATE_MASTER_SUB_SERVICES, requestCreateMasterSubServices),
    takeLatest(REQUEST_UPDATE_MASTER_SUB_SERVICES, requestUpdateMasterSubServices),
    takeLatest(REQUEST_DELETE_MASTER_SUB_SERVICES, requestDeleteMasterSubServices),
  ]);
};

export default subservicesMasterSaga;
