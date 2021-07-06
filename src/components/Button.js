import React from "react";

const Button = ({ text }) => {
  return <button id="btn-spike">{text}</button>;
};

Button.defaultProps = {
  text: "{ Text Here }",
};

export default Button;
