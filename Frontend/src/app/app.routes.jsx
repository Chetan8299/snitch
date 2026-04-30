import { createBrowserRouter } from "react-router"
import Login from "../features/auth/pages/Login.jsx"
import Register from "../features/auth/pages/Register.jsx"

export const appRoutes = createBrowserRouter([
    {
        path: "/",
        element: <div>Home</div>,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
])