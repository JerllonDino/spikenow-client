import { useState, useEffect } from "react";
import { AiOutlinePlusSquare } from "react-icons/ai";
import { Form, Modal, Button, Spinner } from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const NewTask = ({
  showTask,
  setShowTask,
  isAddingTask,
  isDeletingTask,
  onSubmit,
  onDelete,
  selectedTask,
  setShowNewEmail,
}) => {
  const [title, setTitle] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [todo, setTodo] = useState("");
  const [status, setStatus] = useState("open");

  useEffect(() => {
    console.log(selectedTask);
    if (selectedTask.length > 0) {
      setIsUpdate(true);
      setTitle(selectedTask[0].title);
      setStatus(selectedTask[0].status);
      setTodo(selectedTask[0].todo);
      setShowTask(true);
      console.log(selectedTask);
    }
  }, [selectedTask]);

  useEffect(() => {
    if (showTask === false) {
      handleClose();
    }
  }, [showTask]);

  const handleClose = (isBack = false) => {
    setTitle("");
    setTodo("");
    setStatus("open");
    setIsUpdate(false);
    setShowTask(false);
    setShowNewEmail(isBack);
  };

  const handleSave = () => {
    if (isUpdate) {
      onSubmit({ title, status, todo, id: selectedTask[0]._id });
    } else {
      onSubmit({ title, status, todo });
    }
  };

  const handleDelete = () => {
    console.log("deletes");
    onDelete(selectedTask[0]._id);
  };

  return (
    <Modal show={showTask} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Task</Modal.Title>
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
            <Form.Label>Status</Form.Label>
            <Form.Control
              as="select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="open">Open</option>
              <option value="inProgress">In Progress</option>
              <option value="stuck">Stuck</option>
              <option value="done">Done</option>
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Task:</Form.Label>
            <ReactQuill theme="snow" value={todo} onChange={setTodo} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="d-flex">
        <Button
          variant="secondary"
          className={`mr-auto ${isUpdate ? "d-none" : ""}`}
          onClick={() => handleClose(true)}
        >
          Back
        </Button>
        <Button
          variant="danger"
          className={`${!isUpdate ? "d-none" : "d-flex"}`}
          onClick={handleDelete}
        >
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            className={`${
              !isDeletingTask ? "d-none" : ""
            } align-self-center mr-1`}
          />
          Delete Task
        </Button>
        <Button variant="primary" onClick={handleSave}>
          {" "}
          {isAddingTask ? (
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
          Save Task
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewTask;
