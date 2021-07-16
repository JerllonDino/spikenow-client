import {
  useContext,
  useState,
  useEffect,
  useCallback,
  useReducer,
} from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { AuthorizedUserContext } from "../../components/AuthorizedRoutes";
import ChatBody from "./ChatBody";
import ChatSideBar from "./ChatSideBar";
import ChatBox from "./boxes/ChatBox";
import ChatBubble from "./ChatBubble";
import NewEmail from "./modals/NewEmail";
import NewNote from "./modals/NewNote";
import NoteBox from "./boxes/NoteBox";
import socket from "../../socket";
import LoadingOverlay from "../../components/LoadingOverlay";
import {
  getEmails,
  sortEmail,
  getNotes,
  getTasks,
  addReceivedEmails,
  getMessages,
  sendMessage,
  updateNote,
  addNote,
  deleteNote,
  addTask,
  updateTask,
  deleteTask,
  getMessagesByGroup,
} from "./helpers/ChatHelpers";
import { getTimeFromDate } from "../../components/GlobalHelpers";
import NewTask from "./modals/NewTask";
import TaskBox from "./boxes/TaskBox";
import { useRef } from "react";

const Chat = () => {
  const { userInfo } = useContext(AuthorizedUserContext);
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [showBody, setShowBody] = useState(false);
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState(
    "This message is from SpikeNow Replica"
  );
  const [isSending, setIsSending] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [showNewEmail, setShowNewEmail] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [showTask, setShowTask] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [selectedMessage, setSelectedMessage] = useState([]);
  const [showOptions, setShowOptions] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [todayNotes, setTodayNotes] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [selectedNote, setSelectedNote] = useState([]);
  const [selectedTask, setSelectedTask] = useState([]);
  const [selectedGroupChat, setSelectedGroupChat] = useState({});
  const [isDeletingNote, setIsDeletingNote] = useState(false);
  const [isDeletingTask, setIsDeletingTask] = useState(false);
  const [activeNavButton, setActiveNavButton] = useState("chat");

  const handleTodayNotes = useCallback((notes) => {
    console.log("notes?");
    setTodayNotes(notes);
    console.log(notes);
  }, []);

  const handleTodayTasks = useCallback((tasks) => {
    console.log("tasks?");
    setTodayTasks(tasks);
    console.log(tasks);
  }, []);
  const handlePrivateMessage = useCallback(
    ({ content, from, to }) => {
      console.log("current emails retreived", emails);
      const user = connectedUsers.find((user) => user.userID === from);
      console.log("from pm", connectedUsers);
      if (user && user.email === selectedEmail) {
        const receivedMessage = [...selectedMessage, content[0]];
        setSelectedMessage(receivedMessage);
      }
      content[0].time = new Date(content[0].time);
      content[0].contact = content[0].sender;

      const newEmails = addReceivedEmails([...emails, content[0]]);
      setEmails(newEmails);
    },
    [emails, connectedUsers, selectedEmail]
  );

  const handleGroupMessage = useCallback(({ content, from }) => {
    getMessagesByGroup(from, userInfo.email).then((data) => {
      console.log(data);
      if (data) {
        setSelectedMessage([...data, content[0]]);
      } else {
        setSelectedMessage([]);
      }

      setIsChatLoading(false);
      console.log("chatloaded");
    });
  }, []);

  useEffect(() => {
    console.log("first effect chat");
    if (activeNavButton === "chat") {
      socket.connect();
      const { id, email } = userInfo;
      socket.emit("join-chat-room", { id, email });
      getEmails().then((retrievedEmails) => {
        if (retrievedEmails) {
          const sortedEmails = sortEmail(userInfo.email, retrievedEmails);
          console.log(sortedEmails);
          setEmails(sortedEmails);
          console.log("useEff got it");
        }
      });
    }
    return () => {
      socket.disconnect();
    };
  }, [activeNavButton]);

  useEffect(() => {
    console.log("second effect note");
    if (!isAddingNote || !isDeletingNote) {
      getNotes(userInfo.id).then(handleTodayNotes);
    }
  }, [isAddingNote, isDeletingNote, handleTodayNotes, userInfo.id]);

  useEffect(() => {
    console.log("third effect task");
    if (!isAddingTask || !isDeletingTask) {
      getTasks(userInfo.id).then(handleTodayTasks);
    }
  }, [isAddingTask, isDeletingTask, handleTodayTasks, userInfo.id]);

  useEffect(() => {
    console.log("fifth effect group message");
    socket.on("private message", handlePrivateMessage);

    socket.on("users", (users) => {
      console.log("connected users retrieved");
      setConnectedUsers(users);
    });

    socket.on("user connected", (user) => {
      console.log("user just connected");
      setConnectedUsers([...connectedUsers, user]);
    });

    socket.on("user disconnected", (userID) => {
      // socket.removeAllListeners("private message");
      const newConnectedUsers = connectedUsers.filter(
        (user) => user.userID !== userID
      );
      console.log("New Connected Users:", newConnectedUsers);
      setConnectedUsers(newConnectedUsers);
    });

    socket.on("disconnect", () => {
      setConnectedUsers([]);
    });

    return () => {
      socket.off("join-chat-room");
      socket.off("users");

      socket.off("user connected");
      socket.off("user disconnected");
    };
  }, [emails]);

  useEffect(() => {
    if (selectedGroupChat._id) {
      socket.connect();
      const { id, email } = userInfo;
      socket.emit("join-group", {
        groupId: selectedGroupChat._id,
        id,
        email,
      });
    }
  }, [selectedGroupChat]);

  useEffect(() => {
    console.log("fourth effect group message");

    socket.on("group-message", handleGroupMessage);

    socket.on("users-group", (users) => {
      console.log("connected users retrieved");
      setConnectedUsers(users);
    });
    socket.on("user-group-connected", (user) => {
      console.log("user just connected");
      setConnectedUsers([...connectedUsers, user]);
    });

    socket.on("user-group-disconnected", (userID) => {
      // socket.removeAllListeners("private message");
      const newConnectedUsers = connectedUsers.filter(
        (user) => user.userID !== userID
      );
      console.log("New Connected Users:", newConnectedUsers);
      setConnectedUsers(newConnectedUsers);
      console.log("");
    });
    return () => {
      socket.off("join-group");
      socket.off("group-message");
      socket.off("users-group");
      socket.off("user-group-connected");
      socket.off("user-group-disconnected");
    };
  }, [selectedGroupChat]);

  const handleClose = (modalShow = "") => {
    setNewEmail("");
    setNewMessage("");
    setNewSubject("");
    setShowNote(modalShow === "note" ? true : false);
    setShowTask(modalShow === "task" ? true : false);
    setShowNewEmail(false);
  };

  const filterBubble = (messageId) => {
    const newBubble = selectedMessage.filter((data) => data.id !== messageId);
    setSelectedMessage(newBubble);
    setActiveNavButton("chat");
  };

  const setSelectedContact = (email, name, group = {}) => {
    setShowBody(true);
    setSelectedName(name);
    setSelectedEmail(email);

    if (email !== selectedEmail) {
      if (group._id) {
        setIsChatLoading(true);
        getMessagesByGroup(group._id, userInfo.email).then((data) => {
          console.log(data);
          if (data) {
            setSelectedMessage(data);
          } else {
            setSelectedMessage([]);
          }

          setIsChatLoading(false);
          console.log("chatloaded");
        });
        return;
      }
      setIsChatLoading(true);
      getMessages(email, userInfo.email).then((selectedMessages) => {
        console.log(selectedMessages);
        if (selectedMessage) {
          setSelectedMessage(selectedMessages);
        } else {
          setSelectedMessage([]);
        }

        setIsChatLoading(false);
        console.log("chatloaded");
      });
    }
  };

  const listenTrashAll = (id) => {
    const filterDeleted = emails.filter((email) => email.id !== id);
    setEmails(filterDeleted);
  };

  const chatBox = () => {
    return emails.reduce((filtered, email) => {
      const {
        id,
        contact,
        sender,
        receiver,
        subject,
        snippet,
        time,
        labelIds,
      } = email;
      const findStar = labelIds.find((label) => label === "STARRED");
      if (sender.email !== receiver.email) {
        filtered.push(
          <ChatBox
            id={id}
            contact={contact.name}
            subject={subject ? subject.value : ""}
            snippet={snippet}
            receiver={receiver}
            onClick={setSelectedContact}
            email={contact.email}
            time={getTimeFromDate(time)}
            isStarred={findStar ? true : false}
            listener={listenTrashAll}
            key={id}
          />
        );
      }
      return filtered;
    }, []);
  };

  const noteBox = () => {
    return todayNotes.reduce((filtered, note) => {
      filtered.push(
        <NoteBox note={note} onClick={setSelectedNote} key={note.id} />
      );
      return filtered;
    }, []);
  };

  const chatBubble = () => {
    return selectedMessage.map((message) => {
      return (
        <ChatBubble
          key={message.id}
          message={message}
          filterBubble={filterBubble}
        />
      );
    });
  };
  const onSend = async (newEmail, newSubject, newMessage) => {
    console.log("sending");
    setIsSending(true);

    let to = newEmail ? newEmail : selectedEmail;
    let messageSubject = newSubject ? newSubject : subject;
    let messageContent = newMessage ? newMessage : message;

    if (!selectedEmail && !newEmail) {
      alert("no email selected");
      setIsSending(false);
      return;
    }

    if (selectedGroupChat._id) {
      messageSubject = `${userInfo.full_name.split(" ")[0]} from ${
        selectedGroupChat.name
      } @Spikenow Replica Group`;
      messageContent += `<br><footer style="display:none"> From:${selectedGroupChat._id}@spikenowreplica.group</footer>`;
      console.log(to);
    }

    if (!message && !newEmail) {
      alert("Please enter a message");
      setIsSending(false);
      return;
    }

    sendMessage(to, messageSubject, messageContent)
      .then((response) => {
        const email = sortEmail(
          userInfo.email,
          [response.messageSent],
          false,
          "asc"
        );
        console.log("sentEmail", email);
        if (selectedEmail === email[0].contact.email) {
          const sentMessage = [...selectedMessage, email[0]];
          setSelectedMessage(sentMessage);
        }

        if (!selectedGroupChat._id) {
          email[0].time = new Date(email[0].time);
          email[0].contact = email[0].receiver;
          const newEmails = addReceivedEmails([...emails, email[0]]);
          setEmails(newEmails);

          const socketReceiver = connectedUsers.find(
            (user) => user.email === selectedEmail
          );
          console.log("Emitted", connectedUsers, selectedEmail);
          if (socketReceiver) {
            socket.emit("private message", {
              content: email,
              to: socketReceiver.userID,
            });
          }
        } else {
          socket.emit("group-message", {
            content: email,
            to: selectedGroupChat._id,
          });
        }

        setIsSending(false);
        handleClose();
      })
      .catch((error) => console.log(error));

    setMessage("");
    setSubject("This message is from SpikeNow Replica");
  };

  const onSaveNote = async (noteToSave) => {
    const { title, text, id } = noteToSave;
    setIsAddingNote(true);
    // console.log("id?", id);
    if (id) {
      console.log(id);
      updateNote(title, text, id).then((data) => {
        console.log(data);
        alert(`Note with the title: ${data.title} updated!`);
        setShowNote(false);
        setIsAddingNote(false);
      });
      return;
    }
    addNote(title, text, userInfo.id).then((data) => {
      console.log(data);
      alert(`Note with the title: ${data.title} added!`);
      setShowNote(false);
      setIsAddingNote(false);
    });
    return;
  };

  const onDeleteNote = async (noteID) => {
    setIsDeletingNote(true);
    deleteNote(noteID).then((data) => {
      console.log(data);
      alert(`Noted with ID : ${noteID} deleted!`);
      setShowNote(false);
      setIsDeletingNote(false);
    });
  };

  const onSaveTask = async (taskToSave) => {
    const { title, status, todo, id } = taskToSave;
    console.log(status);
    setIsAddingTask(true);
    // console.log("id?", id);
    if (id) {
      console.log(id);
      updateTask(title, status, todo, id).then((data) => {
        console.log(data);
        alert(`Task with the title: ${data.title} updated!`);
        setShowTask(false);
        setIsAddingTask(false);
      });
      return;
    }
    addTask(title, status, todo, userInfo.id).then((data) => {
      console.log(data);
      alert(`Task with the title: ${data.title} added!`);
      setShowTask(false);
      setIsAddingTask(false);
    });
    return;
  };

  const onDeleteTask = async (taskID) => {
    setIsDeletingTask(true);
    deleteTask(taskID).then((data) => {
      console.log(data);
      alert(`Task with ID : ${taskID} deleted!`);
      setShowTask(false);
      setIsDeletingTask(false);
    });
  };

  const taskBox = () => {
    return todayTasks.reduce((filtered, task) => {
      filtered.push(
        <TaskBox task={task} onClick={setSelectedTask} key={task.id} />
      );
      return filtered;
    }, []);
  };

  return (
    <Container fluid>
      <Row>
        <Col
          md={4}
          className="border border-bottom-0 border-top-0 m-0 p-0 min-vh-100 d-flex flex-column"
        >
          <ChatSideBar
            noteBoxes={noteBox()}
            chatBoxes={chatBox()}
            taskBoxes={taskBox()}
            setShowBody={setShowBody}
            onSend={onSend}
            activeNavButton={activeNavButton}
            setActiveNavButton={setActiveNavButton}
            setSelectedGroupChat={setSelectedGroupChat}
            selectedGroupChat={selectedGroupChat}
            setShowNewEmail={setShowNewEmail}
            setShowOptions={setShowOptions}
            onClick={setSelectedContact}
          />
        </Col>
        <Col
          md={8}
          className="border-0 m-0 p-0 bg-light min-vh-100 d-flex flex-column"
        >
          <LoadingOverlay isLoading={isChatLoading} />
          <ChatBody
            onSubmit={onSend}
            receiverName={selectedName}
            receiverEmail={selectedEmail}
            setSelectedEmail={setSelectedEmail}
            message={message}
            subject={subject}
            setSubject={setSubject}
            setMessage={setMessage}
            isShowBody={showBody}
            setShowBody={setShowBody}
            bubble={chatBubble()}
            isSending={isSending}
            setShowNewEmail={setShowNewEmail}
            setShowOptions={setShowOptions}
            setNewEmail={setNewEmail}
            selectedGroupChat={selectedGroupChat}
          />
        </Col>
      </Row>
      <NewEmail
        showNewEmail={showNewEmail}
        showOptions={showOptions}
        handleClose={handleClose}
        newEmail={newEmail}
        setNewEmail={setNewEmail}
        newSubject={newSubject}
        setNewSubject={setNewSubject}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        onSubmit={onSend}
        isSending={isSending}
      />
      <NewNote
        setShowNewEmail={setShowNewEmail}
        showNote={showNote}
        setShowNote={setShowNote}
        isAddingNote={isAddingNote}
        selectedNote={selectedNote}
        onSubmit={onSaveNote}
        onDelete={onDeleteNote}
      />

      <NewTask
        setShowNewEmail={setShowNewEmail}
        showTask={showTask}
        setShowTask={setShowTask}
        isAddingTask={isAddingTask}
        isDeletingTask={isDeletingTask}
        selectedTask={selectedTask}
        onSubmit={onSaveTask}
        onDelete={onDeleteTask}
      />
    </Container>
  );
};

export default Chat;
