import axios from "axios";
import { all, put, takeLatest, call } from "redux-saga/effects";
import { REQUEST_AUTH, REQUEST_SESSION, SET_USER } from "./authActionType";

// eslint-disable-next-line require-yield
function* login(action: Record<string, any>): any {
  try {
    console.log("test test");
    console.log(action);
  } catch (err) {
    console.error(`Error fetching switched account`, action);
  }
}
function* requestSession(action: Record<string, any>): any {
  try {
    const result: any = yield call(getSession);
    yield put({ type: SET_USER, payload: result.data.user });
  } catch (err) {
    console.error(`Error fetching switched account`, action);
  }
}

export function getSession() {
  return axios({
    method: "post",
    url: `${process.env.REACT_APP_BASE_URL}/auth/admin/session`,
    withCredentials: true,
    headers: {
      "Access-Control-Allow-Credentials": "true",
    },
  });
}

const authSaga = function* () {
  yield all([
    takeLatest(REQUEST_AUTH, login),
    takeLatest(REQUEST_SESSION, requestSession),
  ]);
};

export default authSaga;
