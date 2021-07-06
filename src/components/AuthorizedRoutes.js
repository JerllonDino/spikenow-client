import { createContext } from "react";
import { Switch } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Chat from "../containers/Auth";
import socket from "../socket";

export const AuthorizedUserContext = createContext();

const AuthorizedRoutes = () => {
  const userInfo = sessionStorage;

  if (userInfo) {
    const { id, email } = userInfo;
    socket.auth = { id, email };
    console.log("should be connected");
  }

  return (
    <AuthorizedUserContext.Provider value={{ userInfo }}>
      <Switch>
        <ProtectedRoute exact path="/web/chat" component={Chat} />
      </Switch>
    </AuthorizedUserContext.Provider>
  );
};

export default AuthorizedRoutes;
