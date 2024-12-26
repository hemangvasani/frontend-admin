import axios from "axios";
import { get } from "lodash";
import { all, call, put, takeLatest } from "redux-saga/effects";
import {
  ERROR_DONATION,
  REQUEST_DONATION,
  SET_DONATION,
} from "./donationActionTypes";

function* requestDonation(action: Record<string, any>): any {
  try {
    const result: any = yield call(getDonationrMaster);
    yield put({ type: SET_DONATION, payload: result.data });
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
    yield put({ type: ERROR_DONATION, payload: message });
  }
}

export function getDonationrMaster() {
  return axios({
    method: "get",
    url: `${process.env.REACT_APP_BASE_URL}/donation`,
    withCredentials: true,
  });
}

const donationSaga = function* () {
  yield all([takeLatest(REQUEST_DONATION, requestDonation)]);
};

export default donationSaga;
