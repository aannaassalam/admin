import { lazy } from "react";

const privateRoutes = [
  {
    route: "/categories",
    id: "categories",
    Component: lazy(() => import("../layout/pages/categories/categories.jsx")),
  },
  {
    route: "/dashboard",
    id: "dashboard",
    Component: lazy(() => import("../layout/pages/dashboard/dashboard.jsx")),
  },
  {
    route: "/categories/:category",
    id: "subcategory",
    Component: lazy(() =>
      import("../layout/pages/subcategories/subcategories.jsx")
    ),
  },
  {
    route: "/nutuyu",
    id: "nutuyu",
    Component: lazy(() => import("../layout/pages/nutuyu/nutuyu.jsx")),
  },
  {
    route: "/orders",
    id: "orders",
    Component: lazy(() => import("../layout/pages/orders/orders")),
  },
  {
    route: "/products",
    id: "products",
    Component: lazy(() => import("../layout/pages/products/products.jsx")),
  },
  {
    route: "/settings",
    id: "settings",
    Component: lazy(() => import("../layout/pages/settings/settings.jsx")),
  },
  {
    route: "/login",
    id: "login",
    Component: lazy(() => import("../layout/pages/login/login.jsx")),
  },
];
export default privateRoutes;
