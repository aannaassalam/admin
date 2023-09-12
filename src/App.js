import "./App.css";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./layout/components/sidebar/sidebar";
import Navbar from "./layout/components/navbar/navbar";
import Categories from "./layout/pages/categories/categories";
import { createTheme, ThemeProvider } from "@mui/material";
import Loader from "./layout/components/loader/loader";
import { useAuth } from "./layout/hooks/useAuth";
import { useEffect } from "react";
import privateRoutes from "./router/privateRouter";
import publicRoutes from "./router/publicRouter";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const location = useLocation();
  const { user, loading } = useAuth();

  // useEffect(() => {
  //   if (!loading && !user && location.pathname !== "/login") {
  //     window.location.href = "/login";
  //   } else if (!loading && user && location.pathname === "/login") {
  //     window.location.href = "/categories";
  //   }
  // }, [loading]);

  return (
    <ThemeProvider theme={darkTheme}>
      <Loader />
      <div className="App">
        {location.pathname !== "/login" && <Sidebar />}
        <div
          className={
            location.pathname !== "/login" ? "container" : "container login"
          }
        >
          {location.pathname !== "/login" && <Navbar />}
          <Routes location={location}>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            {privateRoutes.map((Item, key) => {
              return (
                <Route
                  exact
                  path={Item.route}
                  key={key}
                  element={<Item.Component />}
                />
              );
            })}
          </Routes>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
