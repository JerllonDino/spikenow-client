import { useState, useEffect } from "react";
import { AiOutlinePlusSquare } from "react-icons/ai";
import { Form, Modal, Button, Spinner } from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const NewNote = ({
  showNote,
  setShowNote,
  isAddingNote,
  onSubmit,
  onDelete,
  selectedNote,
  setShowNewEmail,
}) => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    console.log(selectedNote);
    if (selectedNote.length > 0) {
      setIsUpdate(true);
      setTitle(selectedNote[0].title);
      setText(selectedNote[0].text);
      setShowNote(true);
      console.log(selectedNote);
    }
  }, [selectedNote]);

  const handleClose = (isBack = false) => {
    setTitle("");
    setText("");
    setIsUpdate(false);
    setShowNote(false);
    setShowNewEmail(isBack);
  };

  const handleSave = () => {
    console.log("isUpdate?", isUpdate);
    console.log(selectedNote);
    if (isUpdate) {
      onSubmit({ title, text, id: selectedNote[0]._id });
    } else {
      onSubmit({ title, text });
    }
  };

  const handleDelete = () => {
    console.log("deletes");
    onDelete(selectedNote[0]._id);
  };

  return (
    <Modal show={showNote} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Note</Modal.Title>
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
        <Button
          variant="danger"
          className={`${!isUpdate ? "d-none" : ""}`}
          onClick={handleDelete}
        >
          Delete Note
        </Button>
        <Button variant="primary" onClick={handleSave}>
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
          Save Note
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewNote;
