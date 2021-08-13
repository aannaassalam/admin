import { Route, Switch } from "react-router";
import { Prompt, Redirect, useLocation } from "react-router-dom";
import "./App.css";
import Navbar from "./layout/components/navbar/navbar";
import { Categories } from "./layout/pages/categories/categories";
import Dashboard from "./layout/pages/dashboard/dashboard";
import Login from "./layout/pages/login/login";
import Orders from "./layout/pages/orders/orders";
import Products from "./layout/pages/products/products";
import Ratings from "./layout/pages/ratings/ratings";
import Settings from "./layout/pages/settings/settings";
import firebase from "firebase";
import { useEffect, useState } from "react";
import Loader from "./layout/components/loader/loader";
import Alert from "./layout/pages/alert/alert";
import Users from "./layout/pages/users/users";

function App() {
  const location = useLocation();
  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase
          .firestore()
          .collection("admin")
          .get()
          .then((snap) => {
            snap.forEach((doc) => {
              if (doc.data().email === user.email) {
                setUser(true);
                setLoading(false);
              } else {
                setLoading(false);
              }
            });
          });
      } else {
        setLoading(false);
      }
    });
  }, []);

  return (
    <div className="App">
      {location.pathname !== "/" &&
      (location.pathname === "/dashboard" ||
        location.pathname === "/products" ||
        location.pathname === "/settings" ||
        location.pathname === "/categories" ||
        location.pathname === "/orders" ||
        location.pathname === "/ratings" ||
        location.pathname === "/alerts" ||
        location.pathname === "/users") ? (
        <Navbar />
      ) : null}

      {loading ? (
        <Loader />
      ) : (
        <Switch>
          <Route
            exact
            path="/"
            render={(props) =>
              !user ? <Login {...props} /> : <Redirect to="/dashboard" />
            }
          />
          <Route
            exact
            path="/dashboard"
            render={(props) =>
              user ? <Dashboard {...props} /> : <Redirect to="/" />
            }
          />
          <Route
            exact
            path="/products"
            render={(props) =>
              user ? <Products {...props} /> : <Redirect to="/" />
            }
          />
          <Route
            exact
            path="/settings"
            render={(props) =>
              user ? <Settings {...props} /> : <Redirect to="/" />
            }
          />
          <Route
            exact
            path="/categories"
            render={(props) =>
              user ? <Categories {...props} /> : <Redirect to="/" />
            }
          />
          <Route
            exact
            path="/orders"
            render={(props) =>
              user ? <Orders {...props} /> : <Redirect to="/" />
            }
          />
          <Route
            exact
            path="/ratings"
            render={(props) =>
              user ? <Ratings {...props} /> : <Redirect to="/" />
            }
          />
          <Route
            exact
            path="/alerts"
            render={(props) =>
              user ? <Alert {...props} /> : <Redirect to="/" />
            }
          />
          <Route
            exact
            path="/users"
            render={(props) =>
              user ? <Users {...props} /> : <Redirect to="/" />
            }
          />
        </Switch>
      )}
    </div>
  );
}

export default App;
