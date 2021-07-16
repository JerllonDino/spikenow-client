import { useState, useEffect } from "react";
import { Card, Button, Dropdown } from "react-bootstrap";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaStar, FaRegStar, FaRegTrashAlt } from "react-icons/fa";
import { letterColors } from "../helpers/ChatHelpers";
import { starEmail, trashConversation } from "../helpers/ChatHelpers";

const ChatBox = ({
  id,
  email,
  contact,
  subject,
  snippet,
  onClick,
  time,
  isStarred,
  listener,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [starStatus, setStarStatus] = useState(isStarred);

  const handleStarEmail = () => {
    starEmail(id, !starStatus).then((data) => {
      setStarStatus(!starStatus);
      console.log(data);
    });
  };

  const handleTrashAll = () => {
    trashConversation(email).then((data) => {
      listener(id);
      console.log(data);
    });
  };
  // console.log(isStarExists);
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className="rounded-0 border-0 p-3 d-flex flex-row"
        id="chat-box"
        onClick={() => onClick(email, contact)}
      >
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
      </Card>
      <Dropdown className={`${!subject ? "d-none" : ""}`}>
        <Dropdown.Toggle
          variant="light"
          className={`position-absolute rounded-circle shadow-none justify-content-center align-items-center h6 p-0 ${
            isHovered ? "d-flex" : "d-none"
          }`}
          style={{
            right: "3%",
            transform: "translateY(-220%)",
            width: "30px",
            height: "30px",
            zIndex: "9",
          }}
        >
          <BsThreeDotsVertical />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={handleStarEmail}>
            {starStatus ? <FaStar /> : <FaRegStar />}{" "}
            {starStatus ? "UnStar" : "Star"}
          </Dropdown.Item>
          <Dropdown.Item onClick={handleTrashAll}>
            <FaRegTrashAlt /> Trash All
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default ChatBox;
