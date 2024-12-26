import { combineReducers } from "@reduxjs/toolkit";
import auth from "./auth/reducer";
import users from "./user/reducer";
import donations from "./donation/reducer";
import categories from "./category/reducer";
import events from "./event/reducer";
import news from "./news/reducer";
import homes from "./home/reducer";
import ourservices from "./ourservices/reducer";
import subservices from "./subservices/reducer";
import ourclients from "./ourclients/reducer";
import contact from "./contactus/reducer";
import faqs from "./faq/reducer";

export default combineReducers({
  auth,
  users,
  donations,
  categories,
  events,
  news,
  ourservices,
  subservices,
  ourclients,
  homes,
  contact,
  faqs,
});
