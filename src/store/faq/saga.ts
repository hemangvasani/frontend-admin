import axios from "axios";
import { get } from "lodash";
import { all, call, put, takeLatest } from "redux-saga/effects";
import {
  REQUEST_MASTER_FAQS,
  REQUEST_CREATE_MASTER_FAQS,
  SET_MASTER_FAQS,
  SUCCESS_CREATE_MASTER_FAQS,
  ERROR_GET_MASTER_FAQS,
  ERROR_CREATE_MASTER_FAQS,
  SUCCESS_UPDATE_MASTER_FAQS,
  ERROR_UPDATE_MASTER_FAQS,
  SUCCESS_DELETE_MASTER_FAQS,
  ERROR_DELETE_MASTER_FAQS,
  REQUEST_UPDATE_MASTER_FAQS,
  REQUEST_DELETE_MASTER_FAQS,
  SET_MASTER_FAQS_CATEGORIES,
  ERROR_GET_MASTER_FAQS_CATEGORIES,
  REQUEST_MASTER_FAQS_CATEGORIES,
} from "./faqActionTypes";

function* requestMasterFaqs(action: Record<string, any>): any {
  try {
    const result: any = yield call(getFaqsMaster);
    yield put({ type: SET_MASTER_FAQS, payload: result.data.data.faqs });
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
    yield put({ type: ERROR_GET_MASTER_FAQS, payload: message });
  }
}

function* requestMasterFaqsCat(action: Record<string, any>): any {
  try {
    const result: any = yield call(getFaqsMaster);
    yield put({ type: SET_MASTER_FAQS_CATEGORIES, payload: result.data.data.categories });
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
    yield put({ type: ERROR_GET_MASTER_FAQS_CATEGORIES, payload: message });
  }
}

function* requestUpdateMasterFaqs(action: Record<string, any>): any {
  try {
    const result = yield call(
      updateMasterFaqs,
      action.data.payload,
      action.data._id
    );
    yield put({
      type: SUCCESS_UPDATE_MASTER_FAQS,
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
    yield put({ type: ERROR_UPDATE_MASTER_FAQS, payload: message });
  }
}

function* requestDeleteMasterFaqs(action: Record<string, any>): any {
  try {
    yield call(deleteMasterFaqs, get(action, "payload._id", ""));
    yield put({
      type: SUCCESS_DELETE_MASTER_FAQS,
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
    yield put({ type: ERROR_DELETE_MASTER_FAQS, payload: message });
  }
}

function* requestCreateMasterFaqs(action: Record<string, any>): any {
  
  try {
    const result = yield call(createMasterFaqs, action.payload);

    yield put({
      type: SUCCESS_CREATE_MASTER_FAQS,
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
    yield put({ type: ERROR_CREATE_MASTER_FAQS, payload: message });
  }
}

export function getFaqsMaster() {
  return axios({
    method: "GET",
    url: `${process.env.REACT_APP_BASE_URL}/faqs`,
    withCredentials: true,
  });
}

export function createMasterFaqs(payload: Record<string, any>) {
  return axios({
    method: "post",
    url: `${process.env.REACT_APP_BASE_URL}/faqs`,
    data: payload,
    withCredentials: true,
  });
}

export function deleteMasterFaqs(_id: string) {
  return axios({
    method: "delete",
    url: `${process.env.REACT_APP_BASE_URL}/faqs/${_id}`,
    withCredentials: true,
  });
}
export function updateMasterFaqs(
  payload: Record<string, any>,
  _id: string
) {
  return axios({
    method: "patch",
    url: `${process.env.REACT_APP_BASE_URL}/faqs/${_id}`,
    data: payload,
    withCredentials: true,
  });
}

const faqsMasterSaga = function* () {
  yield all([
    takeLatest(REQUEST_MASTER_FAQS, requestMasterFaqs),
    takeLatest(REQUEST_MASTER_FAQS_CATEGORIES, requestMasterFaqsCat),
    takeLatest(REQUEST_CREATE_MASTER_FAQS, requestCreateMasterFaqs),
    takeLatest(REQUEST_UPDATE_MASTER_FAQS, requestUpdateMasterFaqs),
    takeLatest(REQUEST_DELETE_MASTER_FAQS, requestDeleteMasterFaqs),
  ]);
};

export default faqsMasterSaga;
