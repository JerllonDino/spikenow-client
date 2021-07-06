import myAxios from "../utils/connection";
import { Button } from "react-bootstrap";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import { useHistory } from "react-router";
import { BiLogOut } from "react-icons/bi";
import socket from "../socket";

export const Login = ({ text }) => {
  const history = useHistory();

  const handleLogin = async ({ code }) => {
    const res = await myAxios.post("/google-auth", {
      code,
    });

    const { token, email, full_name, id } = await res.data;
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("email", email);
    sessionStorage.setItem("full_name", full_name);
    sessionStorage.setItem("id", id);
    if (token) {
      history.push("/web/chat");
    }
  };
  const handleFailure = async (error) => console.log(error);
  return (
    <GoogleLogin
      clientId="886519749145-kjltr7kubuadpgpnli3lfh10bb9g0rn8.apps.googleusercontent.com"
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
      scope="https://mail.google.com/"
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
    sessionStorage.clear();
    socket.disconnect();
    history.push("/");
    return;
  }
  return (
    <GoogleLogout
      clientId="886519749145-kjltr7kubuadpgpnli3lfh10bb9g0rn8.apps.googleusercontent.com"
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
