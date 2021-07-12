import React from "react";
import { Card } from "react-bootstrap";
import { letterColors } from "../helpers/ChatHelpers";

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
            className={`rounded-circle d-flex justify-content-center align-items-center`}
            style={{
              width: "45px",
              height: "45px",
              backgroundColor: contact
                ? letterColors(contact.toUpperCase().charAt(0)).color
                : "#007bff",
            }}
          >
            <h5 className="p-0 m-0 text-light">
              {contact ? contact.toUpperCase().charAt(0) : ""}
            </h5>
          </div>
        </div>
        <div
          style={{ lineHeight: "1rem" }}
          className="d-flex flex-column my-auto"
        >
          <h6 className="m-0">{contact}</h6>
          {subject ? (
            <>
              <small className="d-block">{subject}</small>
              <small className="text-muted">
                {snippet.length > 50
                  ? snippet.substring(0, 50 - 3) + "..."
                  : snippet}
              </small>
            </>
          ) : (
            ""
          )}
        </div>
        <div className="ml-auto">
          <small>{time}</small>
        </div>
      </div>
    </Card>
  );
};

export default ChatBox;
