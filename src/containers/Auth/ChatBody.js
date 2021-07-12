import { useState, useEffect, useRef } from "react";
import { Card, Form, Button, Spinner, Dropdown } from "react-bootstrap";
import { HiOutlineAtSymbol } from "react-icons/hi";
import { BiCode } from "react-icons/bi";
import { FaLessThan, FaPaperPlane } from "react-icons/fa";
import { AiOutlinePlusCircle, AiFillAudio } from "react-icons/ai";
import { BsCameraVideoFill } from "react-icons/bs";
import { Logout } from "../../components/GoogleAuth";
import { v4 } from "uuid";

const ChatBody = ({
  onSubmit,
  receiverName,
  receiverEmail,
  setSelectedEmail,
  message,
  subject,
  setSubject,
  setMessage,
  isShowBody,
  setShowBody,
  bubble,
  isSending,
  setShowNewEmail,
  setShowOptions,
  setNewEmail,
}) => {
  const [isFocusMessage, setIsFocusMessage] = useState(false);
  const messagesEndRef = useRef(null);
  const handleShow = () => {
    setShowOptions(false);
    setNewEmail(receiverEmail);
    setShowNewEmail(true);
  };

  const handleCloseBody = () => {
    setShowBody(false);
    setSelectedEmail("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [bubble]);

  const handleSubmit = () => {
    setIsFocusMessage(false);
    onSubmit();
  };

  const handleSendMeeting = (isVideo) => {
    const roomID = v4();
    const messageHTML = `
        <p>Join ${isVideo ? "Video" : "Audio"} Meeting</p>
        <a
        class="btn btn-primary"
          href="/web/meeting/${roomID}/${isVideo ? 1 : 0}"
          target="_blank"
        >
          Join Meeting
        </a>
      `;
    // setMessage(messageHTML);
    onSubmit(receiverEmail, "Join Spike Replica Meeting", messageHTML);
  };

  return (
    <>
      <div>
        <Card
          className="w-100 border-top-0 border-left-0 border-right-0 rounded-0"
          style={{ height: "50px" }}
        >
          <div className="d-flex justify-content-between align-items-center my-auto mx-3">
            <h6>
              {" "}
              {isShowBody ? (
                <FaLessThan
                  className="cursor-pointer mr-2"
                  onClick={handleCloseBody}
                />
              ) : (
                ""
              )}{" "}
              {isShowBody ? receiverName : "Welcome to SpikeNow"}
            </h6>
            <Logout />
          </div>
        </Card>
      </div>
      {!isShowBody ? (
        <div
          className="d-flex flex-grow-1 justify-content-center align-items-center"
          style={{
            height: "0px",
            overflowY: "scroll",
          }}
        >
          <HiOutlineAtSymbol
            className="display-1"
            style={{ color: "lightgrey" }}
          />
        </div>
      ) : (
        <>
          <div
            className="d-flex flex-column flex-grow-1 px-3"
            style={{
              height: "0px",
              overflowY: "auto",
              backgroundColor: "white",
            }}
          >
            {bubble}
            <div ref={messagesEndRef}></div>
          </div>
          <div
            className="d-flex flex-column m-0 p-0"
            onFocus={(e) => setIsFocusMessage(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                // Not triggered when swapping focus between children
                setIsFocusMessage(false);
              }
            }}
          >
            <Form.Control
              type="text"
              style={{ fontSize: ".7rem", fontWeight: "bold" }}
              className={`rounded-0 border-right-0 border-left-0 shadow-none m-0 ${
                isFocusMessage ? "d-inline-block" : "d-none"
              }`}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <div className="d-flex" style={{ height: "50px" }}>
              <Form.Control
                type="text"
                className="rounded-0 border-right-0 border-left-0 shadow-none h-100"
                value={message}
                placeholder="Message"
                onChange={(e) => setMessage(e.target.value)}
              />

              <Button
                variant="link"
                className="bg-white border-top border-bottom rounded-0 m-0"
                onClick={handleShow}
              >
                {" "}
                <BiCode />{" "}
              </Button>
              <Dropdown className="border-top border-bottom">
                <Dropdown.Toggle
                  variant="link"
                  className="bg-white rounded-0 m-0 h-100 "
                >
                  <AiOutlinePlusCircle />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleSendMeeting(true)}>
                    <BsCameraVideoFill /> Video Meeting
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSendMeeting(false)}>
                    <AiFillAudio /> Audio Meeting
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              {/* <Button
                variant="link"
                className="bg-white border-top border-bottom rounded-0 m-0"
                onClick={openNewWindow}
              >
                <AiOutlinePlusCircle />
              </Button> */}
              <Button
                variant="link"
                className="bg-white border-top border-bottom rounded-0 m-0"
                onClick={handleSubmit}
                disabled={isSending ? true : false}
              >
                {" "}
                {isSending ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  <FaPaperPlane />
                )}{" "}
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ChatBody;
