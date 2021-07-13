import { useState, useEffect, useContext } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { ImPencil2 } from "react-icons/im";
import { BsChatDotsFill, BsChatDots } from "react-icons/bs";
import { AiOutlineClockCircle, AiFillClockCircle } from "react-icons/ai";
import { HiOutlineUserGroup, HiUserGroup } from "react-icons/hi";
import { RiContactsLine, RiContactsFill, RiMenuAddFill } from "react-icons/ri";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import EventBox from "./boxes/EventBox";
import myAxios from "../../utils/connection";
import LoadingOverlay from "../../components/LoadingOverlay";
import NewEvent from "./modals/NewEvent";
import ChatBox from "./boxes/ChatBox";
import { AuthorizedUserContext } from "../../components/AuthorizedRoutes";
import GroupBox from "./boxes/GroupBox";

const ChatSideBar = ({
  noteBoxes,
  chatBoxes,
  taskBoxes,
  setShowNewEmail,
  setShowOptions,
  activeNavButton,
  setActiveNavButton,
  setShowBody,
  onClick,
}) => {
  const { userInfo } = useContext(AuthorizedUserContext);
  const [events, setEvents] = useState([]);
  const [eventDatePicker, setEventDatePicker] = useState(new Date());
  const [isEventsLoading, setIsEventsLoading] = useState(false);
  const [isShowEvent, setIsShowEvent] = useState(false);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState([]);
  const [isDeletingEvent, setIsDeletingEvent] = useState(false);
  const [contacts, setContacts] = useState([]);
  const handleShow = () => {
    setShowOptions(true);
    setShowNewEmail(true);
  };

  const handleChangeDate = (date) => {
    console.log(date.getTime());
    setIsEventsLoading(true);
    myAxios
      .get(`/getEvents/${date.getTime()}`)
      .then((events) => {
        setIsEventsLoading(false);
        console.log(events.data.data.items);
        setEvents(events.data.data.items);
      })
      .catch((error) => console.log(error));
    setEventDatePicker(date);
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getFullDate = (date) => {
    const newDate = new Date(date);
    if (!date) return "Upcoming Events";
    return `${
      months[newDate.getMonth()]
    } ${newDate.getDate()}, ${newDate.getFullYear()}`;
  };

  useEffect(() => {
    const date = new Date();
    const dateAsString = date.toString();
    const timezone = dateAsString.match(/\(([^\)]+)\)$/)[1];

    console.log(timezone);
    switch (activeNavButton) {
      case "events":
        setShowBody(false);

        setIsEventsLoading(true);
        myAxios
          .get(`/getEvents`)
          .then((events) => {
            setIsEventsLoading(false);
            console.log(events.data.data.items);
            setEvents(events.data.data.items);
          })
          .catch((error) => console.log(error));
        break;

      case "contacts":
        setShowBody(false);
        myAxios.get("/getOtherContacts").then(({ data }) => {
          setContacts(data.otherContacts);
        });
        break;
      default:
        break;
    }
  }, [activeNavButton]);

  const handleChangeSidebar = (value) => {
    setActiveNavButton(value);
  };

  const saveEvent = ({
    title,
    description,
    inviteList,
    eventDate,
    startTime,
    endTime,
    id,
  }) => {
    setIsAddingEvent(true);
    myAxios
      .post("/saveEvent", {
        title,
        description,
        inviteList,
        eventDate,
        startTime,
        endTime,
        id,
      })
      .then((response) => {
        setIsAddingEvent(false);
        setIsShowEvent(false);
        if (eventDatePicker) {
          handleChangeDate(eventDatePicker);
        }
        console.log(response);
      })
      .catch((error) => console.log(error));
  };

  const deleteEvent = (id) => {
    setIsDeletingEvent(true);
    myAxios
      .delete(`/deleteEvent/${id}`)
      .then((response) => {
        setIsDeletingEvent(false);
        setIsShowEvent(false);
        if (eventDatePicker) {
          handleChangeDate(eventDatePicker);
        }
        console.log(response);
        console.log("deleted");
      })
      .catch((error) => console.log(error));
  };

  const viewSwitch = () => {
    switch (activeNavButton) {
      case "chat":
        return (
          <>
            <h6
              className={`mx-3 ${noteBoxes.length > 0 ? "d-inline" : "d-none"}`}
            >
              Notes
            </h6>
            {noteBoxes}
            <h6
              className={`mx-3 ${taskBoxes.length > 0 ? "d-inline" : "d-none"}`}
            >
              Tasks
            </h6>
            {taskBoxes}
            <h6 className="mx-3">Today</h6>
            {chatBoxes}
          </>
        );
      case "events":
        return (
          <div className="d-flex flex-column">
            <div>
              <h6 className="text-center mt-2">Choose a date to add event</h6>
              <Calendar
                onChange={handleChangeDate}
                value={eventDatePicker}
                className="w-100 border-left-0 border-right-0 border-top border-bottom"
              />
              <div className="d-flex justify-content-between mx-4">
                <h6 className="mt-2">
                  Events on {getFullDate(eventDatePicker)}
                </h6>
                <Button
                  variant="success"
                  className="p-0 ml-5 mt-1 rounded-circle shadow-none"
                  style={{ width: "30px", height: "30px" }}
                  onClick={() => setIsShowEvent(true)}
                >
                  <RiMenuAddFill className="h5 m-0 p-0" />
                </Button>
              </div>
            </div>
            <div
              className="px-0 flex-grow-1"
              style={{ height: "100%", overflowY: "auto" }}
            >
              <LoadingOverlay isLoading={isEventsLoading} />
              {events.length > 0 ? (
                events.map((event) => (
                  <EventBox event={event} onClick={setSelectedEvent} />
                ))
              ) : (
                <Alert variant="danger" className="mx-5">
                  No Events Found on {getFullDate(eventDatePicker)}
                </Alert>
              )}
            </div>
          </div>
        );

      case "contacts":
        return contacts.map(({ emailAddresses }, index) => {
          if (emailAddresses[0].value !== userInfo.email) {
            return (
              <ChatBox
                key={index}
                email={emailAddresses[0].value}
                contact={emailAddresses[0].value}
                onClick={onClick}
              />
            );
          }
        });

      case "group":
        return (
          <>
            <h6>Categories</h6>
            <GroupBox category={0} />
            <GroupBox category={1} />
            <GroupBox category={2} />
            <GroupBox category={3} />
            <GroupBox category={4} />
            <GroupBox category={5} />
          </>
        );

      default:
        break;
    }
  };

  return (
    <>
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
          <h6 className="my-auto ml-2">{localStorage.getItem("full_name")}</h6>
        </div>
      </Card>
      <div
        className="px-0 flex-grow-1"
        style={{ height: "0px", overflowY: "auto" }}
      >
        {viewSwitch()}
      </div>
      <div>
        <Card
          className="w-100 border-left-0 border-right-0 rounded-0 d-flex flex-row justify-content-around p-0"
          style={{ height: "50px" }}
        >
          <Button
            variant="link"
            className="my-auto shadow-none rounded-circle p-0 d-flex justify-content-center"
            style={{ width: "35px", height: "35px" }}
            onClick={() => handleChangeSidebar("chat")}
          >
            {activeNavButton === "chat" ? (
              <BsChatDotsFill className="h2 align-self-center m-0 text-dark" />
            ) : (
              <BsChatDots className="h2 align-self-center m-0 text-dark" />
            )}
          </Button>
          <Button
            variant="link"
            className="my-auto shadow-none rounded-circle p-0 d-flex justify-content-center"
            style={{ width: "35px", height: "35px" }}
            onClick={() => handleChangeSidebar("events")}
          >
            {activeNavButton === "events" ? (
              <AiFillClockCircle className="h2 align-self-center m-0 text-dark" />
            ) : (
              <AiOutlineClockCircle className="h2 align-self-center m-0 text-dark" />
            )}
          </Button>

          <Button
            variant="primary"
            className="my-auto shadow-none rounded-circle p-0 d-flex justify-content-center"
            style={{ width: "40px", height: "40px" }}
            onClick={handleShow}
          >
            <ImPencil2 className="h4 align-self-center m-0" />
          </Button>

          <Button
            variant="link"
            className="my-auto shadow-none rounded-circle p-0 d-flex justify-content-center"
            style={{ width: "35px", height: "35px" }}
            onClick={() => handleChangeSidebar("group")}
          >
            {activeNavButton === "group" ? (
              <HiUserGroup className="h2 align-self-center m-0 text-dark" />
            ) : (
              <HiOutlineUserGroup className="h2 align-self-center m-0 text-dark" />
            )}
          </Button>
          <Button
            variant="link"
            className="my-auto shadow-none rounded-circle p-0 d-flex justify-content-center"
            style={{ width: "35px", height: "35px" }}
            onClick={() => handleChangeSidebar("contacts")}
          >
            {activeNavButton === "contacts" ? (
              <RiContactsFill className="h2 align-self-center m-0 text-dark" />
            ) : (
              <RiContactsLine className="h2 align-self-center m-0 text-dark" />
            )}
          </Button>
        </Card>
      </div>
      <NewEvent
        isShowEvent={isShowEvent}
        setIsShowEvent={setIsShowEvent}
        isAddingEvent={isAddingEvent}
        isDeletingEvent={isDeletingEvent}
        onSubmit={saveEvent}
        onDelete={deleteEvent}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
      />
    </>
  );
};

export default ChatSideBar;
