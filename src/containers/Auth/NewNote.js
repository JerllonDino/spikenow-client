import { useState } from "react";
import { AiOutlinePlusSquare } from "react-icons/ai";
import { Form, Modal, Button, Spinner } from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const NewEmail = ({
  showNote,
  setShowNote,
  isAddingNote,
  onSubmit,
  setShow,
}) => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const handleClose = (isBack = false) => {
    setShowNote(false);
    setShow(isBack);
  };

  return (
    <Modal show={showNote} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>New Note</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Note:</Form.Label>
            <ReactQuill
              theme="snow"
              value={text}
              onChange={setText}
              style={{ minHeight: "300px" }}
            />
            {/* <div dangerouslySetInnerHTML={{ __html: newMessage }}></div> */}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="d-flex">
        <Button
          variant="secondary"
          className="mr-auto"
          onClick={() => handleClose(true)}
        >
          Back
        </Button>
        <Button variant="primary" onClick={() => onSubmit(title, text)}>
          {" "}
          {isAddingNote ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : (
            <AiOutlinePlusSquare />
          )}{" "}
          Add Note
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewEmail;
