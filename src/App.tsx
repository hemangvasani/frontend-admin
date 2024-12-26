import axios from "axios";
import { Fragment } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import "antd/dist/antd.css";
import { get } from "lodash";
import Login from "./pages/Login/Login";
import AuthenticatedRoute from "./components/Auth/AuthenticatedRoute";
import User from "./pages/user/User";
import Sidebar from "./components/Header/Sidebar";
import Donation from "./pages/donation/Donation";
import Category from "./pages/category/Category";
import Event from "./pages/Event/Event";
import News from "./pages/news/News";
import OurServices from "./pages/ourservices/OurServices";
import Home from "./pages/home/Home";
import OurClients from "./pages/ourclients/OurClients";
import Contactus from "./pages/contactus/Contactus";
import HomeForm from "./pages/HomeForm/HomeForm";
import Faqs from "./pages/faqs/Faqs";

const App = () => {
  axios.interceptors.request.use(
    (config: any) => {
      config.headers.authorization = localStorage.getItem("token");
      return config;
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (config: any) => {
      return config;
    },
    (error: any) => {
      if (get(error, "response.status") === 403) {
        localStorage.clear();
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );

  return (
    <Router>
      <Fragment>
        <Routes>
          <Route
            path="/login"
            element={
              <>
                <Login />
              </>
            }
          ></Route>
          <Route
            path="/"
            element={
              <>
                <Sidebar />
                <AuthenticatedRoute />
              </>
            }
          >
            <Route path="/" element={<HomeForm />}></Route>
            <Route path="/ourservices" element={<OurServices />}></Route>
            <Route path="/ourclients" element={<OurClients />}></Route>
            <Route path="/product" element={<Home />}></Route>
            <Route path="/customer" element={<Donation />}></Route>
            <Route path="/events" element={<Donation />}></Route>
            <Route path="/services" element={<Category />}></Route>
            {/* <Route path="/ourclients" element={<OurClients />}></Route> */}
            <Route path="/faqs" element={<Faqs />}></Route>
            <Route path="/contactus" element={<Contactus />}></Route>

            <Route path="*" element={<Navigate replace to="/" />} />
          </Route>
        </Routes>
      </Fragment>
    </Router>
  );
};

export default App;
