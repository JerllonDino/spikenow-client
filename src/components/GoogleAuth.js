import myAxios from "../utils/connection";
import { Button } from "react-bootstrap";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import { useHistory } from "react-router";
import { BiLogOut } from "react-icons/bi";
import socket from "../socket";
import dotenv from "dotenv";
dotenv.config();

const clientID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

export const Login = ({ text }) => {
  const history = useHistory();

  const handleLogin = async ({ code }) => {
    const res = await myAxios.post("/google-auth", {
      code,
    });

    const { token, email, full_name, id } = await res.data;
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    localStorage.setItem("full_name", full_name);
    localStorage.setItem("id", id);
    if (token) {
      history.push("/web/chat");
    }
  };
  const handleFailure = async (error) => console.log(error);
  return (
    <GoogleLogin
      clientId={clientID}
      render={(renderProps) => (
        <button
          onClick={renderProps.onClick}
          disabled={renderProps.disabled}
          id="btn-spike"
        >
          {text}
        </button>
      )}
      onSuccess={handleLogin}
      onFailure={handleFailure}
      scope="https://mail.google.com/ https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/contacts https://www.googleapis.com/auth/contacts.other.readonly"
      cookiePolicy={"single_host_origin"}
      accessType="offline"
      responseType="code"
      prompt="consent"
    />
  );
};

export const Logout = ({ text }) => {
  const history = useHistory();
  async function logout() {
    localStorage.clear();
    socket.disconnect();
    history.push("/");
    return;
  }
  return (
    <GoogleLogout
      clientId={clientID}
      accessType="offline"
      onLogoutSuccess={logout}
      onFailure={logout}
      render={(renderProps) => (
        <Button
          onClick={renderProps.onClick}
          disabled={renderProps.disabled}
          variant="link"
          className="py-0 my-1"
        >
          <h4 className="m-0">
            <BiLogOut />
            {text ? text : ""}
          </h4>
        </Button>
      )}
    />
  );
};
