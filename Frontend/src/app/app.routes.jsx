import { createBrowserRouter, Outlet } from "react-router";
import AppLayout from "./AppLayout.jsx";
import Login from "../features/auth/pages/Login.jsx";
import Register from "../features/auth/pages/Register.jsx";
import CreateProduct from "../features/products/pages/CreateProduct.jsx";
import Dashboard from "../features/products/pages/Dashboard.jsx";
import Protected from "../features/auth/components/Protected.jsx";
import Home from "../features/products/pages/Home.jsx";
import ProductDetail from "../features/products/pages/ProductDetail.jsx";
import SellerProductDetail from "../features/products/pages/SellerProductDetail.jsx";
import Cart from "../features/cart/pages/Cart.jsx";

export const appRoutes = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/cart",
    element: (
      <Protected>
        <Cart />
      </Protected>
    ),
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/product/:id",
        element: <ProductDetail />,
      },

      {
        path: "/seller",
        element: <Outlet />,
        children: [
          {
            path: "create-product",
            element: (
              <Protected role="seller">
                <CreateProduct />
              </Protected>
            ),
          },
          {
            path: "dashboard",
            element: (
              <Protected role="seller">
                <Dashboard />
              </Protected>
            ),
          },
          {
            path: "/seller/product/:productId",
            element: (
              <Protected role="seller">
                <SellerProductDetail />
              </Protected>
            ),
          },
        ],
      },
    ],
  },
]);
