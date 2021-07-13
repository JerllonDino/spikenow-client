import React from "react";
import { GrNotes } from "react-icons/gr";
import { Card } from "react-bootstrap";
import { getTimeFromDate } from "../../../components/GlobalHelpers";

const EventBox = ({ event, onClick }) => {
  console.log(event);
  const { description, summary, updated } = event;
  const time = new Date(updated);
  function removeTags(str) {
    if (str === null || str === "") return false;
    else str = str.toString();

    return str.replace(/(<([^>]+)>)/gi, "");
  }
  const textStripped = removeTags(description);
  return (
    <Card
      className="rounded-0 border-0 p-3"
      id="chat-box"
      onClick={() => onClick([event])}
    >
      <div className="d-flex">
        <div className="mr-3 my-auto">
          <div
            className="rounded-circle bg-primary d-flex justify-content-center align-items-center"
            style={{ width: "40px", height: "40px" }}
          >
            <h5 className="p-0 m-0">
              <GrNotes />
            </h5>
          </div>
        </div>
        <div style={{ lineHeight: "1rem" }}>
          <h6 className="m-0">{summary}</h6>
          <small className="d-block">Event</small>
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

export default EventBox;
