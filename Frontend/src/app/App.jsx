import React, { useEffect } from "react";
import { RouterProvider } from "react-router";
import { appRoutes } from "./app.routes";
import "./App.css";
import { useAuth } from "../features/auth/hook/useAuth";
import { useSelector } from "react-redux";

const App = () => {
  const { handleGetMe } = useAuth();

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    handleGetMe();
  }, []);

  console.log(user);
  return <RouterProvider router={appRoutes} />;
};

export default App;
