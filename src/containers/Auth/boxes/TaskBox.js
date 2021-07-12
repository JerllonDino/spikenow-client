import React from "react";
import { BiTask } from "react-icons/bi";
import { Card } from "react-bootstrap";
import { getTimeFromDate } from "../../../components/GlobalHelpers";

const TaskBox = ({ task, onClick }) => {
  const { id, title, status, todo, updatedAt } = task;
  const time = new Date(updatedAt);
  function removeTags(str) {
    if (str === null || str === "") return false;
    else str = str.toString();

    return str.replace(/(<([^>]+)>)/gi, "");
  }
  const textStripped = removeTags(todo);
  const statusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-secondary";
      case "inProgress":
        return "bg-primary";
      case "stuck":
        return "bg-warning";
      case "done":
        return "bg-success";

      default:
        break;
    }
  };
  return (
    <Card
      className="rounded-0 border-0 p-3"
      id="chat-box"
      onClick={() => onClick([task])}
    >
      <div className="d-flex">
        <div className="mr-3 my-auto">
          <div
            className={`rounded-circle d-flex justify-content-center align-items-center ${statusColor(
              status
            )}`}
            style={{ width: "40px", height: "40px" }}
          >
            <h5 className="p-0 m-0">
              <BiTask />
            </h5>
          </div>
        </div>
        <div style={{ lineHeight: "1rem" }}>
          <h6 className="m-0">{title}</h6>
          <small className="d-block">Task</small>
          <small className="text-muted">
            {textStripped.length > 50
              ? textStripped.substring(0, 50 - 3) + "..."
              : textStripped}
          </small>
        </div>
        <div className="ml-auto">
          <small>{getTimeFromDate(time)}</small>
        </div>
      </div>
    </Card>
  );
};

export default TaskBox;
