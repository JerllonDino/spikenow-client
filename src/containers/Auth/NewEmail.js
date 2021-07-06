import { FaStickyNote } from "react-icons/fa";
import { Form, Modal, Button, Spinner } from "react-bootstrap";
import { FaPaperPlane } from "react-icons/fa";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const NewEmail = ({
  show,
  showOptions,
  handleClose,
  onSubmit,
  newEmail,
  setNewEmail,
  newSubject,
  setNewSubject,
  newMessage,
  setNewMessage,
  isSending,
}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Message</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>To:</Form.Label>
            <Form.Control
              type="email"
              placeholder="johndoe@email.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Subject: </Form.Label>
            <Form.Control
              type="text"
              placeholder="Title/Main Context"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Message:</Form.Label>
            <ReactQuill
              theme="snow"
              value={newMessage}
              onChange={setNewMessage}
              style={{ minHeight: "300px" }}
            />
            {/* <div dangerouslySetInnerHTML={{ __html: newMessage }}></div> */}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="d-flex">
        <Button
          variant="primary"
          className={`mr-auto ${showOptions ? "" : "d-none"}`}
          onClick={() => handleClose(true)}
        >
          <FaStickyNote />
          Add Note
        </Button>
        <Button
          variant="link"
          className="bg-white"
          onClick={() => onSubmit(newEmail, newSubject, newMessage)}
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
      </Modal.Footer>
    </Modal>
  );
};

export default NewEmail;
