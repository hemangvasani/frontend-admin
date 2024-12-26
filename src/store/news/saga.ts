import axios from "axios";
import { get } from "lodash";
import { all, call, put, takeLatest } from "redux-saga/effects";
import {
  REQUEST_MASTER_NEWS,
  REQUEST_CREATE_MASTER_NEWS,
  SET_MASTER_NEWS,
  SUCCESS_CREATE_MASTER_NEWS,
  ERROR_GET_MASTER_NEWS,
  ERROR_CREATE_MASTER_NEWS,
  SUCCESS_UPDATE_MASTER_NEWS,
  ERROR_UPDATE_MASTER_NEWS,
  SUCCESS_DELETE_MASTER_NEWS,
  ERROR_DELETE_MASTER_NEWS,
  REQUEST_UPDATE_MASTER_NEWS,
  REQUEST_DELETE_MASTER_NEWS,
} from "./newsActionTypes";

function* requestMasterNews(action: Record<string, any>): any {
  try {
    const result: any = yield call(getNewsMaster);
    yield put({ type: SET_MASTER_NEWS, payload: result.data });
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
    yield put({ type: ERROR_GET_MASTER_NEWS, payload: message });
  }
}

function* requestUpdateMasterNews(action: Record<string, any>): any {
  try {
    const result = yield call(
      updateMasterNews,
      action.data.payload,
      action.data._id
    );
    yield put({
      type: SUCCESS_UPDATE_MASTER_NEWS,
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
    yield put({ type: ERROR_UPDATE_MASTER_NEWS, payload: message });
  }
}

function* requestDeleteMasterNews(action: Record<string, any>): any {
  try {
    yield call(deleteMasterNews, get(action, "payload._id", ""));
    yield put({
      type: SUCCESS_DELETE_MASTER_NEWS,
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
    yield put({ type: ERROR_DELETE_MASTER_NEWS, payload: message });
  }
}

function* requestCreateMasterNews(action: Record<string, any>): any {
  

  try {
    const result = yield call(createMasterNews, action.payload);
    
    yield put({
      type: SUCCESS_CREATE_MASTER_NEWS,
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
    yield put({ type: ERROR_CREATE_MASTER_NEWS, payload: message });
  }
}

export function getNewsMaster() {
  return axios({
    method: "GET",
    url: `${process.env.REACT_APP_BASE_URL}/admin/news`,
    withCredentials: true,
  });
}

export function createMasterNews(payload: Record<string, any>) {
  return axios({
    method: "post",
    url: `${process.env.REACT_APP_BASE_URL}/admin/news`,
    data: payload,
    withCredentials: true,
  });
}

export function deleteMasterNews(_id: string) {
  return axios({
    method: "delete",
    url: `${process.env.REACT_APP_BASE_URL}/admin/news/${_id}`,
    withCredentials: true,
  });
}
export function updateMasterNews(
  payload: Record<string, any>,
  _id: string
) {
  return axios({
    method: "patch",
    url: `${process.env.REACT_APP_BASE_URL}/admin/news/${_id}`,
    data: payload,
    withCredentials: true,
  });
}

const newsMasterSaga = function* () {
  yield all([
    takeLatest(REQUEST_MASTER_NEWS, requestMasterNews),
    takeLatest(REQUEST_CREATE_MASTER_NEWS, requestCreateMasterNews),
    takeLatest(REQUEST_UPDATE_MASTER_NEWS, requestUpdateMasterNews),
    takeLatest(REQUEST_DELETE_MASTER_NEWS, requestDeleteMasterNews),
  ]);
};

export default newsMasterSaga;
