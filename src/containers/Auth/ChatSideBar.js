import { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { ImPencil2 } from "react-icons/im";

const ChatSideBar = ({ noteBoxes, chatBoxes, setShow, setShowOptions }) => {
  const handleShow = () => {
    setShowOptions(true);
    setShow(true);
  };
  return (
    <>
      <div>
        <Card
          className="w-100 border-top-0 border-left-0 border-right-0 rounded-0"
          style={{ height: "50px" }}
        >
          <div className="d-flex my-auto mx-3">
            <img
              src="https://randomuser.me/api/portraits/men/9.jpg"
              className="rounded-circle"
              width="40"
              height="40"
              alt=""
            />
            <h6 className="my-auto ml-2">
              {sessionStorage.getItem("full_name")}
            </h6>
          </div>
        </Card>
      </div>
      <div
        className="px-0 flex-grow-1"
        style={{ height: "0px", overflowY: "auto" }}
      >
        <h6 className="mx-3">Notes</h6>
        {noteBoxes}
        <h6 className="mx-3">Today</h6>
        {chatBoxes}
      </div>
      <div>
        <Card
          className="w-100 border-left-0 border-right-0 rounded-0 d-flex justify-content-center p-0"
          style={{ height: "50px" }}
        >
          <Button
            variant="primary"
            className="my-auto shadow-none rounded-circle p-0 d-flex justify-content-center align-self-center"
            style={{ width: "35px", height: "35px" }}
          >
            <ImPencil2
              className="h5 align-self-center m-0"
              onClick={handleShow}
            />
          </Button>
        </Card>
      </div>
    </>
  );
};

export default ChatSideBar;
