import axios from "axios";
import { get } from "lodash";
import { all, call, put, takeLatest } from "redux-saga/effects";
import {
  REQUEST_MASTER_CATEGORIES,
  REQUEST_CREATE_MASTER_CATEGORIES,
  SET_MASTER_CATEGORIES,
  SUCCESS_CREATE_MASTER_CATEGORIES,
  ERROR_GET_MASTER_CATEGORIES,
  ERROR_CREATE_MASTER_CATEGORIES,
  SUCCESS_UPDATE_MASTER_CATEGORIES,
  ERROR_UPDATE_MASTER_CATEGORIES,
  SUCCESS_DELETE_MASTER_CATEGORIES,
  ERROR_DELETE_MASTER_CATEGORIES,
  REQUEST_UPDATE_MASTER_CATEGORIES,
  REQUEST_DELETE_MASTER_CATEGORIES,
} from "./categoryActionTypes";

function* requestMasterCategories(action: Record<string, any>): any {
  try {
    const result: any = yield call(getCategoriesMaster);
    yield put({ type: SET_MASTER_CATEGORIES, payload: result.data });
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
    yield put({ type: ERROR_GET_MASTER_CATEGORIES, payload: message });
  }
}

function* requestUpdateMasterTag(action: Record<string, any>): any {
  try {
    const result = yield call(
      updateMasterCategories,
      action.data.payload,
      action.data._id
    );
    yield put({
      type: SUCCESS_UPDATE_MASTER_CATEGORIES,
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
    yield put({ type: ERROR_UPDATE_MASTER_CATEGORIES, payload: message });
  }
}

function* requestDeleteMasterTag(action: Record<string, any>): any {
  try {
    yield call(deleteMasterCategories, get(action, "payload._id", ""));
    yield put({
      type: SUCCESS_DELETE_MASTER_CATEGORIES,
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
    yield put({ type: ERROR_DELETE_MASTER_CATEGORIES, payload: message });
  }
}

function* requestCreateMasterCategories(action: Record<string, any>): any {
  
  try {
    const result = yield call(createMasterCategories, action.payload);

    yield put({
      type: SUCCESS_CREATE_MASTER_CATEGORIES,
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
    yield put({ type: ERROR_CREATE_MASTER_CATEGORIES, payload: message });
  }
}

export function getCategoriesMaster() {
  return axios({
    method: "GET",
    url: `${process.env.REACT_APP_BASE_URL}/category`,
    withCredentials: true,
  });
}

export function createMasterCategories(payload: Record<string, any>) {
  return axios({
    method: "post",
    url: `${process.env.REACT_APP_BASE_URL}/category`,
    data: payload,
    withCredentials: true,
  });
}

export function deleteMasterCategories(_id: string) {
  return axios({
    method: "delete",
    url: `${process.env.REACT_APP_BASE_URL}/category/${_id}`,
    withCredentials: true,
  });
}
export function updateMasterCategories(
  payload: Record<string, any>,
  _id: string
) {
  return axios({
    method: "patch",
    url: `${process.env.REACT_APP_BASE_URL}/category/${_id}`,
    data: payload,
    withCredentials: true,
  });
}

const categoriesMasterSaga = function* () {
  yield all([
    takeLatest(REQUEST_MASTER_CATEGORIES, requestMasterCategories),
    takeLatest(REQUEST_CREATE_MASTER_CATEGORIES, requestCreateMasterCategories),
    takeLatest(REQUEST_UPDATE_MASTER_CATEGORIES, requestUpdateMasterTag),
    takeLatest(REQUEST_DELETE_MASTER_CATEGORIES, requestDeleteMasterTag),
  ]);
};

export default categoriesMasterSaga;
