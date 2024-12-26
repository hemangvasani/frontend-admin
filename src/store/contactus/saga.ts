import axios from "axios";
import { get } from "lodash";
import { all, call, put, takeLatest } from "redux-saga/effects";
import {
  REQUEST_MASTER_CONTACTUS,
  SET_MASTER_CONTACTUS,
  ERROR_GET_MASTER_CONTACTUS,
  SUCCESS_UPDATE_MASTER_CONTACTUS,
  REQUEST_UPDATE_MASTER_CONTACTUS,
  ERROR_UPDATE_MASTER_CONTACTUS,
} from "./contactusActionTypes";

function* requestMasterContact(action: Record<string, any>): any {
  try {
    const result: any = yield call(getContactMaster);
    yield put({ type: SET_MASTER_CONTACTUS, payload: result.data.data });
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
    yield put({ type: ERROR_GET_MASTER_CONTACTUS, payload: message });
  }
}

function* requestUpdateMasterContact(action: Record<string, any>): any {
  try {
    const result = yield call(
      updateMasterContact,
      action.data.payload,
      action.data._id
    );
    yield put({
      type: SUCCESS_UPDATE_MASTER_CONTACTUS,
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
    yield put({ type: ERROR_UPDATE_MASTER_CONTACTUS, payload: message });
  }
}

export function getContactMaster() {
  return axios({
    method: "GET",
    url: `${process.env.REACT_APP_BASE_URL}/contacts`,
    withCredentials: true,
  });
}

export function updateMasterContact(payload: Record<string, any>, _id: string) {
  return axios({
    method: "patch",
    url: `${process.env.REACT_APP_BASE_URL}/contacts/${_id}`,
    data: payload,
    withCredentials: true,
  });
}

const contactMasterSaga = function* () {
  yield all([
    takeLatest(REQUEST_MASTER_CONTACTUS, requestMasterContact),
    takeLatest(REQUEST_UPDATE_MASTER_CONTACTUS, requestUpdateMasterContact),
  ]);
};

export default contactMasterSaga;
