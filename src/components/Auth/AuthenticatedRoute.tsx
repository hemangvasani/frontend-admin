import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { REQUEST_SESSION } from "../../store/auth/authActionType";
import { useAuth } from "../../store/auth/reducer";
import { get } from "lodash";

const AuthenticatedRoute: React.FC = () => {
  const dispatch = useDispatch();
  const { busy, user } = useAuth();
  const token = localStorage.getItem("token");
  // console.log(user);

  if (!busy && !get(user, "_id")) {
    dispatch({ type: REQUEST_SESSION });
  }
  if (busy) {
    return <div>loading....</div>;
  }
  if (user.role === "ADMIN") {
    return <Outlet />;
  }
  if (get(user, "_id")) return <Navigate to={{ pathname: "/login" }} />;
  // if (Object.keys(user).length === 0) {
  //   return <Navigate to={{ pathname: "/login" }} />;
  // }
  if (!token) {
    return <Navigate to={{ pathname: "/login" }} />;
  }

  return <div></div>;
};

export default AuthenticatedRoute;
