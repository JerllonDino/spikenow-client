import React from "react";
import { Card } from "react-bootstrap";

const ChatBox = ({ email, contact, subject, snippet, onClick, time }) => {
  return (
    <Card
      className="rounded-0 border-0 p-3"
      id="chat-box"
      onClick={() => onClick(email, contact)}
    >
      <div className="d-flex">
        <div className="mr-3 my-auto">
          <div
            className="rounded-circle bg-primary d-flex justify-content-center align-items-center"
            style={{ width: "40px", height: "40px" }}
          >
            <h5 className="p-0 m-0">
              {contact ? contact.toUpperCase().charAt(0) : ""}
            </h5>
          </div>
        </div>
        <div style={{ lineHeight: "1rem" }}>
          <h6 className="m-0">{contact}</h6>
          <small className="d-block">{subject}</small>
          <small className="text-muted">
            {snippet.length > 50
              ? snippet.substring(0, 50 - 3) + "..."
              : snippet}
          </small>
        </div>
        <div className="ml-auto">
          <small>{time}</small>
        </div>
      </div>
    </Card>
  );
};

export default ChatBox;
