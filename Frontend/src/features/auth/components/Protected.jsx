import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import { pageStyle } from "../../../app/uiTheme";

const Protected = ({ children, role = "buyer" }) => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={pageStyle}
      >
        <p className="text-sm text-zinc-600">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default Protected;
