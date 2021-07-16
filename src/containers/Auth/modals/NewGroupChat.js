import { useState, useEffect } from "react";
import { AiOutlinePlusSquare } from "react-icons/ai";
import { Form, Modal, Button, Spinner } from "react-bootstrap";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { TiDelete } from "react-icons/ti";
import "react-quill/dist/quill.snow.css";
import {
  getFormattedDate,
  getTimeFromDate,
} from "../../../components/GlobalHelpers";

const NewGroupChat = ({
  isShowGroupChat,
  setIsShowGroupChat,
  isAddingGroupChat,
  isDeletingGroupChat,
  onSubmit,
  onDelete,
  selectedGroupChat,
  setSelectedGroupChat,
}) => {
  const [groupName, setGroupName] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [memberList, setMemberList] = useState([{ email: "" }]);
  const { email } = localStorage;

  useEffect(() => {
    console.log(selectedGroupChat);
    if (selectedGroupChat.name) {
      setIsUpdate(true);
      setGroupName(selectedGroupChat.name);
      setMemberList(
        selectedGroupChat.members ? selectedGroupChat.members : [{ email: "" }]
      );
      console.log(selectedGroupChat);
    }
  }, [selectedGroupChat]);

  useEffect(() => {
    console.log(isDeletingGroupChat);
    if (!isShowGroupChat) {
      handleClose();
    }
  }, [isShowGroupChat]);

  const handleClose = () => {
    setGroupName("");
    setMemberList([{ email: "" }]);
    setIsUpdate(false);
    setSelectedGroupChat({});
    setIsShowGroupChat(false);
  };

  const handleSave = () => {
    console.log("isUpdate?", isUpdate);
    console.log(selectedGroupChat);
    if (isUpdate) {
      onSubmit({
        groupName,
        memberList,
        id: selectedGroupChat._id,
      });
    } else {
      onSubmit({
        groupName,
        memberList,
        creator: email,
      });
    }
  };

  const handleDelete = () => {
    console.log("deletes");
    onDelete(selectedGroupChat._id);
  };

  // handle input change
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...memberList];
    list[index][name] = value;
    setMemberList(list);
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...memberList];
    list.splice(index, 1);
    setMemberList(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setMemberList([...memberList, { email: "" }]);
  };

  return (
    <Modal show={isShowGroupChat} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Group</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Group Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <div className="d-flex align-items-center justify-content-between">
              <Form.Label>Members:</Form.Label>
              <Button
                variant="success"
                className="p-0 px-1"
                onClick={handleAddClick}
              >
                <BsFillPersonPlusFill className="h3 m-0" />
              </Button>
            </div>
            {memberList.map((guest, index) => (
              <Form.Group className="d-flex" key={index}>
                <Form.Control
                  type="email"
                  name="email"
                  value={guest.email}
                  placeholder="Email"
                  onChange={(e) => handleInputChange(e, index)}
                />
                {memberList.length !== 1 && (
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
        </Form>
      </Modal.Body>
      <Modal.Footer className="d-flex">
        <Button
          variant="danger"
          className={`${
            !isUpdate || selectedGroupChat.creatorEmail !== email
              ? "d-none"
              : "d-flex"
          } align-items-center`}
          onClick={handleDelete}
        >
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            className={`mr-1${!isDeletingGroupChat ? " d-none" : ""}`}
          ></Spinner>
          Delete Group
        </Button>
        <Button variant="primary" onClick={handleSave}>
          {" "}
          {isAddingGroupChat ? (
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
          Save Group
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewGroupChat;
