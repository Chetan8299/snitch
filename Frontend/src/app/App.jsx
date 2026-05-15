import React, { useEffect } from "react";
import { RouterProvider } from "react-router";
import { appRoutes } from "./app.routes";
import "./App.css";
import { useAuth } from "../features/auth/hook/useAuth";
const App = () => {
  const { handleGetMe } = useAuth();

  useEffect(() => {
    handleGetMe();
  }, [handleGetMe]);

  return <RouterProvider router={appRoutes} />;
};

export default App;
