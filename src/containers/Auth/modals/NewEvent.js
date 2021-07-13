import { useState, useEffect } from "react";
import { AiOutlinePlusSquare } from "react-icons/ai";
import { Form, Modal, Button, Spinner } from "react-bootstrap";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { TiDelete } from "react-icons/ti";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getFormattedDate,
  getTimeFromDate,
} from "../../../components/GlobalHelpers";

const NewEvent = ({
  isShowEvent,
  setIsShowEvent,
  isAddingEvent,
  isDeletingEvent,
  onSubmit,
  onDelete,
  selectedEvent,
  setSelectedEvent,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [inviteList, setInviteList] = useState([{ email: "" }]);

  useEffect(() => {
    console.log(selectedEvent);
    if (selectedEvent.length > 0) {
      setIsUpdate(true);
      setTitle(selectedEvent[0].summary);
      setDescription(selectedEvent[0].description);
      setEventDate(getFormattedDate(selectedEvent[0].start.dateTime));
      setStartTime(getTimeFromDate(selectedEvent[0].start.dateTime));
      setEndTime(getTimeFromDate(selectedEvent[0].end.dateTime));
      setInviteList(
        selectedEvent[0].attendees
          ? selectedEvent[0].attendees
          : [{ email: "" }]
      );
      setIsShowEvent(true);
      console.log(selectedEvent);
    }
  }, [selectedEvent]);

  useEffect(() => {
    console.log(isDeletingEvent);
    if (!isShowEvent) {
      handleClose();
    }
  }, [isShowEvent]);

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setInviteList([{ email: "" }]);
    setEventDate("");
    setStartTime("");
    setEndTime("");
    setIsUpdate(false);
    setSelectedEvent([]);
    setIsShowEvent(false);
  };

  const handleSave = () => {
    console.log("isUpdate?", isUpdate);
    console.log(selectedEvent);
    if (isUpdate) {
      onSubmit({
        title,
        description,
        inviteList,
        eventDate,
        startTime,
        endTime,
        id: selectedEvent[0].id,
      });
    } else {
      onSubmit({
        title,
        description,
        inviteList,
        eventDate,
        startTime,
        endTime,
      });
    }
  };

  const handleDelete = () => {
    console.log("deletes");
    onDelete(selectedEvent[0].id);
  };

  // handle input change
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inviteList];
    list[index][name] = value;
    setInviteList(list);
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...inviteList];
    list.splice(index, 1);
    setInviteList(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setInviteList([...inviteList, { email: "" }]);
  };

  return (
    <Modal show={isShowEvent} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Event</Modal.Title>
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
          <Form.Group className="d-flex justify-content-between">
            <Form.Group>
              <Form.Label>Date:</Form.Label>
              <Form.Control
                type="date"
                onChange={(e) => setEventDate(e.target.value)}
                value={eventDate}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Start:</Form.Label>
              <Form.Control
                type="time"
                onChange={(e) => setStartTime(e.target.value)}
                value={startTime}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>End:</Form.Label>
              <Form.Control
                type="time"
                onChange={(e) => setEndTime(e.target.value)}
                value={endTime}
              />
            </Form.Group>
          </Form.Group>
          <Form.Group>
            <div className="d-flex align-items-center justify-content-between">
              <Form.Label>Guests:</Form.Label>
              <Button
                variant="success"
                className="p-0 px-1"
                onClick={handleAddClick}
              >
                <BsFillPersonPlusFill className="h3 m-0" />
              </Button>
            </div>
            {inviteList.map((guest, index) => (
              <Form.Group className="d-flex" key={index}>
                <Form.Control
                  type="email"
                  name="email"
                  value={guest.email}
                  onChange={(e) => handleInputChange(e, index)}
                />
                {inviteList.length !== 1 && (
                  <Button
                    variant="danger"
                    className="p-0 px-1 ml-3"
                    onClick={() => handleRemoveClick(index)}
                  >
                    <TiDelete className="h3 m-0" />
                  </Button>
                )}
              </Form.Group>
            ))}
          </Form.Group>
          <Form.Group>
            <Form.Label>Description:</Form.Label>
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="d-flex">
        <Button
          variant="danger"
          className={`${!isUpdate ? "d-none" : "d-flex"} align-items-center`}
          onClick={handleDelete}
        >
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            className={`mr-1${!isDeletingEvent ? " d-none" : ""}`}
          ></Spinner>
          Delete Event
        </Button>
        <Button variant="primary" onClick={handleSave}>
          {" "}
          {isAddingEvent ? (
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
          Save Event
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewEvent;
