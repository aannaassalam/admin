import { lazy } from "react";

const routes = [
  {
    route: "/categories",
    id: "categories",
    Component: lazy(() => import("../layout/pages/categories/categories.jsx")),
  },
  {
    route: "/categories/:category",
    id: "subcategory",
    Component: lazy(() =>
      import("../layout/pages/subcategories/subcategories.jsx")
    ),
  },
  //   {
  //     route: "/profile",
  //     id: "profile",
  //     Component: lazy(() => import("../layout/pages/profile/profile.jsx")),
  //   },
  //   {
  //     route: "/products/:category",
  //     id: "category",
  //     Component: lazy(() => import("../layout/pages/products/products.jsx")),
  //   },
  //   {
  //     route: "/products/:category/:subcategory",
  //     id: "subcategory",
  //     Component: lazy(() => import("../layout/pages/products/products.jsx")),
  //   },
  //   {
  //     route: "/product/:id",
  //     id: "product description",
  //     Component: lazy(() =>
  //       import("../layout/pages/product-details/product-details.jsx")
  //     ),
  //   },
  //   {
  //     route: "/checkout",
  //     id: "checkout",
  //     Component: lazy(() => import("../layout/pages/checkout/checkout.jsx")),
  //   },
];
export default routes;
