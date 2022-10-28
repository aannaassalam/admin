import "./App.css";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./layout/components/sidebar/sidebar";
import Navbar from "./layout/components/navbar/navbar";
import Categories from "./layout/pages/categories/categories";
import { createTheme, ThemeProvider } from "@mui/material";
import routes from "./router/router";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <div className="App">
        <Sidebar />
        <div className="container">
          <Navbar />
          <Routes>
            {routes.map((Item, key) => {
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
