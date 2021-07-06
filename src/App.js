import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Routes from "./components/Routes";
import AuthorizedRoutes from "./components/AuthorizedRoutes";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/web">
          <AuthorizedRoutes />
        </Route>
        <Route path="/">
          <Routes />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
