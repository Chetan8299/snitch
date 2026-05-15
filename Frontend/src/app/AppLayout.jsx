import React from "react";
import { Outlet } from "react-router";
import Navbar from "../features/shared/components/Navbar.jsx";
import { pageStyle } from "./uiTheme";

const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col" style={pageStyle}>
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
