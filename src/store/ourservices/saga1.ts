import axios from "axios";
import { get } from "lodash";
import { all, call, put, takeLatest } from "redux-saga/effects";
import {
  REQUEST_MASTER_OUR_SERVICES,
  REQUEST_CREATE_MASTER_OUR_SERVICES,
  SET_MASTER_OUR_SERVICES,
  SUCCESS_CREATE_MASTER_OUR_SERVICES,
  ERROR_GET_MASTER_OUR_SERVICES,
  ERROR_CREATE_MASTER_OUR_SERVICES,
  SUCCESS_UPDATE_MASTER_OUR_SERVICES,
  ERROR_UPDATE_MASTER_OUR_SERVICES,
  SUCCESS_DELETE_MASTER_OUR_SERVICES,
  ERROR_DELETE_MASTER_OUR_SERVICES,
  REQUEST_UPDATE_MASTER_OUR_SERVICES,
  REQUEST_DELETE_MASTER_OUR_SERVICES,
} from "./ourservicesActionTypes";

function* requestMasterOurServices(action: Record<string, any>): any {
  try {
    const result: any = yield call(getOurServicesMaster);
    yield put({ type: SET_MASTER_OUR_SERVICES, payload: result.data });
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
    yield put({ type: ERROR_GET_MASTER_OUR_SERVICES, payload: message });
  }
}

function* requestUpdateMasterTag(action: Record<string, any>): any {
  try {
    const result = yield call(
      updateMasterOurServices,
      action.data.payload,
      action.data._id
    );
    yield put({
      type: SUCCESS_UPDATE_MASTER_OUR_SERVICES,
      payload: result.data.data,
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
    yield put({ type: ERROR_UPDATE_MASTER_OUR_SERVICES, payload: message });
  }
}

function* requestDeleteMasterTag(action: Record<string, any>): any {
  try {
    yield call(deleteMasterOurServices, get(action, "payload._id", ""));
    yield put({
      type: SUCCESS_DELETE_MASTER_OUR_SERVICES,
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
    yield put({ type: ERROR_DELETE_MASTER_OUR_SERVICES, payload: message });
  }
}

function* requestCreateMasterOurServices(action: Record<string, any>): any {
  try {
    const result = yield call(createMasterOurServices, action.payload);
    
    yield put({
      type: SUCCESS_CREATE_MASTER_OUR_SERVICES,
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
    yield put({ type: ERROR_CREATE_MASTER_OUR_SERVICES, payload: message });
  }
}

export function getOurServicesMaster() {
  return axios({
    method: "GET",
    url: `${process.env.REACT_APP_BASE_URL}/services`,
    withCredentials: true,
    
  });
}
console.log("getOurServicesMaster");

export function createMasterOurServices(payload: Record<string, any>) {
  return axios({
    method: "post",
    url: `${process.env.REACT_APP_BASE_URL}/services`,
    data: payload,
    withCredentials: true,
  });
}

export function deleteMasterOurServices(_id: string) {
  return axios({
    method: "delete",
    url: `${process.env.REACT_APP_BASE_URL}/services/${_id}`,
    withCredentials: true,
  });
}
export function updateMasterOurServices(
  payload: Record<string, any>,
  _id: string
) {
  return axios({
    method: "patch",
    url: `${process.env.REACT_APP_BASE_URL}/services/${_id}`,
    data: payload,
    withCredentials: true,
  });
}

const ourServicesMasterSaga = function* () {
  yield all([
    takeLatest(REQUEST_MASTER_OUR_SERVICES, requestMasterOurServices),
    takeLatest(REQUEST_CREATE_MASTER_OUR_SERVICES, requestCreateMasterOurServices),
    takeLatest(REQUEST_UPDATE_MASTER_OUR_SERVICES, requestUpdateMasterTag),
    takeLatest(REQUEST_DELETE_MASTER_OUR_SERVICES, requestDeleteMasterTag),
  ]);
};

export default ourServicesMasterSaga;
