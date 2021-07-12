import { createContext } from "react";
import { Switch } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Chat from "../containers/Auth";
import Meeting from "../containers/Auth/Meeting";

export const AuthorizedUserContext = createContext();

const AuthorizedRoutes = () => {
  const userInfo = localStorage;

  return (
    <AuthorizedUserContext.Provider value={{ userInfo }}>
      <Switch>
        <ProtectedRoute exact path="/web/chat" component={Chat} />
        <ProtectedRoute
          exact
          path="/web/meeting/:roomID/:isVideo"
          component={Meeting}
        />
      </Switch>
    </AuthorizedUserContext.Provider>
  );
};

export default AuthorizedRoutes;
