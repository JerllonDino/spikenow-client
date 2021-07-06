import logo from "../assets/spikenow.svg";
import { Login } from "./GoogleAuth";
import {
  Navbar,
  NavDropdown,
  Form,
  Nav as BSNav,
  Container,
} from "react-bootstrap";

const Nav = () => {
  return (
    <Navbar fixed="top" bg="white" expand="xl">
      <Container fluid className="px-5">
        <Navbar.Brand href="/">
          <img src={logo} width="114" height="58" alt="" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <BSNav className="mr-auto">
            <NavDropdown title="Products" id="basic-nav-dropdown">
              <NavDropdown.Item href="/features">All features</NavDropdown.Item>
              <NavDropdown.Item href="/features/conversational">
                Conversation Email
              </NavDropdown.Item>
              <NavDropdown.Item href="/features/notes">
                Online Notes
              </NavDropdown.Item>
              <NavDropdown.Item href="/features/tasks">
                Tasks & To-Do Lists
              </NavDropdown.Item>
              <NavDropdown.Item href="/features/search">
                Advanced Search
              </NavDropdown.Item>
              <NavDropdown.Item href="/features/groups">
                Groups
              </NavDropdown.Item>
              <NavDropdown.Item href="/features/calendar">
                Calendar
              </NavDropdown.Item>
              <NavDropdown.Item href="/features/file">
                File Management
              </NavDropdown.Item>
              <NavDropdown.Item href="/features/priority">
                Priority Email Inbox
              </NavDropdown.Item>
              <NavDropdown.Item href="/features/voice">
                Voice Messages
              </NavDropdown.Item>
            </NavDropdown>
            <BSNav.Link href="/use-cases">Use Cases</BSNav.Link>
            <BSNav.Link href="/prices">Prices</BSNav.Link>
            <NavDropdown title="Resources" id="basic-nav-dropdown">
              <NavDropdown.Item href="/help">Help Center</NavDropdown.Item>
              <NavDropdown.Item href="/blog">Blog</NavDropdown.Item>
              <NavDropdown.Item href="/about">About Us</NavDropdown.Item>
            </NavDropdown>
          </BSNav>
          <Form inline>
            <Login text="Get Started" />
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Nav;
