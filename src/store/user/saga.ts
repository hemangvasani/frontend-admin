import axios from "axios";
import { get } from "lodash";
import { all, call, put, takeLatest } from "redux-saga/effects";
import {
  REQUEST_BLOCK_USERS,
  REQUEST_USERS,
  SET_USERS,
  SUCCESS_BLOCK_USERS,
} from "./userActionType";

function* requestUsers(action: Record<string, any>): any {
  try {
    const result: any = yield call(getUserMaster);
    yield put({ type: SET_USERS, payload: result.data });
  } catch (err) {
    console.error(`Error fetching switched account`, action);
  }
}

// function* requestBlockUsers(action: Record<string, any>): any {
//   try {
//     yield call(
//       blockUsers,
//       get(action, "payload._id", " "),
//       get(action, "payload.blockedByAdmin", false)
//     );
//     yield put({
//       type: SUCCESS_BLOCK_USERS,
//       payload: action.payload,
//     });
//   } catch (error: any) {
//     let message =
//       "Something went wrong, please try again after some time or Refresh the Page.";
//     if (get(error, "response.status") === 500) {
//       message = "Something happened wrong try again after sometime.";
//     } else if (get(error, "response.status") === 422) {
//       message = "please provide valid contain";
//     } else if (get(error, "response.status") === 415) {
//       message = error.response.data.message;
//     }
//   }
// }

export function getUserMaster() {
  return axios({
    method: "GET",
    url: `${process.env.REACT_APP_BASE_URL}/user/all`,
    withCredentials: true,
  });
}

// export function blockUsers(_id: string, blockedByAdmin: boolean) {
//   return axios({
//     method: "get",
//     url: `${process.env.REACT_APP_BASE_URL}/admin/user/block/${_id}`,
//     withCredentials: true,
//     data: { blockedByAdmin: blockedByAdmin },
//   });
// }

const userSaga = function* () {
  yield all([
    takeLatest(REQUEST_USERS, requestUsers),
    // takeLatest(REQUEST_BLOCK_USERS, requestBlockUsers),
  ]);
};

export default userSaga;
