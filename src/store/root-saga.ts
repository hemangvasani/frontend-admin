import { all, fork } from "redux-saga/effects";
import authSaga from "./auth/saga";
import userSaga from "./user/saga";
import donationSaga from "./donation/saga";
import categoriesMasterSaga from "./category/saga";
import homesMasterSaga from "./home/saga";
import eventsMasterSaga from "./event/saga";
import newsMasterSaga from "./news/saga";
import ourServicesMasterSaga from "./ourservices/saga";
import subservicesMasterSaga from "./subservices/saga";
import ourclientsMasterSaga from "./ourclients/saga";
import contactMasterSaga from "./contactus/saga";
import faqsMasterSaga from "./faq/saga";

export default function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(userSaga),
    fork(donationSaga),
    fork(categoriesMasterSaga),
    fork(homesMasterSaga),
    fork(ourclientsMasterSaga),
    fork(eventsMasterSaga),
    fork(newsMasterSaga),
    fork(ourServicesMasterSaga),
    fork(subservicesMasterSaga),
    fork(faqsMasterSaga),
    fork(contactMasterSaga),
  ]);
}
