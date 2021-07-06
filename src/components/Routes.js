import { Route, Switch } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Home from "../containers/Home";
import Placeholder from "./Placeholder";

const Routes = () => {
  return (
    <>
      <Header />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route exact path="/features">
          <Placeholder theme="light" title="All Features" />
        </Route>
        <Route exact path="/features/conversational">
          <Placeholder theme="light" title="Conversation Email" />
        </Route>
        <Route exact path="/features/notes">
          <Placeholder theme="light" title="Online Notes" />
        </Route>
        <Route exact path="/features/tasks">
          <Placeholder theme="light" title="Tasks & To-Do Lists" />
        </Route>
        <Route exact path="/features/search">
          <Placeholder theme="light" title="Advanced Search" />
        </Route>
        <Route exact path="/features/groups">
          <Placeholder theme="light" title="Groups" />
        </Route>
        <Route exact path="/features/calendar">
          <Placeholder theme="light" title="Calendar" />
        </Route>
        <Route exact path="/features/file">
          <Placeholder theme="light" title="File Manager" />
        </Route>
        <Route exact path="/features/priority">
          <Placeholder theme="light" title="Priority Email Inbox" />
        </Route>
        <Route exact path="/features/voice">
          <Placeholder theme="light" title="Voice Messages" />
        </Route>
        <Route exact path="/use-cases">
          <Placeholder theme="light" title="Use Cases" />
        </Route>
        <Route exact path="/prices">
          <Placeholder theme="light" title="Prices" />
        </Route>
        <Route exact path="/help">
          <Placeholder theme="light" title="Help Center" />
        </Route>
        <Route exact path="/blog">
          <Placeholder theme="light" title="Blog" />
        </Route>
        <Route exact path="/about">
          <Placeholder theme="light" title="About Us" />
        </Route>
      </Switch>
      <Footer />
    </>
  );
};

export default Routes;
