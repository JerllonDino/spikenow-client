import { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { AuthorizedUserContext } from "./AuthorizedRoutes";

function ProtectedRoute({ component: Component, ...restOfProps }) {
  const userInfo = useContext(AuthorizedUserContext);

  const isAuthenticated = userInfo.length !== 0 ? true : false;

  return (
    <Route
      {...restOfProps}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
}

export default ProtectedRoute;
