import { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import myAxios from "../../utils/connection";
import { AuthorizedUserContext } from "../../components/AuthorizedRoutes";
import ChatBody from "./ChatBody";
import ChatSideBar from "./ChatSideBar";
import ChatBox from "./ChatBox";
import ChatBubble from "./ChatBubble";
import NewEmail from "./NewEmail";
import NewNote from "./NewNote";
import NoteBox from "./NoteBox";
import socket from "../../socket";

const stripContact = (string) => {
  let email = string.substring(
    string.lastIndexOf("<") + 1,
    string.lastIndexOf(">")
  );

  if (email) {
    let name = string.substr(0, string.indexOf("<"));
    name = name.replace(/['"]+/g, "");
    return { email, name };
  }
  return string;
};

const sortEmail = (userEmail, emails, isDuplicate = true, sort = "desc") => {
  let prevSender = [];
  const reduce = emails.reduce(function (filtered, option) {
    // return filtered.includes(option) ? filtered : [...filtered, option];
    const { id, snippet, payload } = option;
    const senderString = payload.headers.find((data) => {
      return data.name === "From" || data.name === "from";
    });

    const receiverString = payload.headers.find((data) => {
      return data.name === "To" || data.name === "to";
    });

    const strippedFrom = stripContact(senderString.value);
    const strippedTo = stripContact(receiverString.value);

    const sender = {
      name: strippedFrom.name ? strippedFrom.name : strippedFrom,
      email: strippedFrom.email ? strippedFrom.email : strippedFrom,
    };

    const receiver = {
      name: strippedTo.name ? strippedTo.name : strippedTo,
      email: strippedTo.email ? strippedTo.email : strippedTo,
    };

    let contact = {
      name: sender.name,
      email: sender.email,
    };

    if (sender.email === userEmail) {
      contact.email = receiver.email;
      contact.name = receiver.name;
    }

    const subject = payload.headers.find((data) => {
      return data.name === "Subject" || data.name === "subject";
    });

    const date = payload.headers.find((data) => {
      return data.name === "Date" || data.name === "date";
    });

    const time = new Date(date.value);

    let content = snippet;

    if (!isDuplicate) {
      if (
        payload.mimeType === "text/plain" ||
        payload.mimeType === "text/html"
      ) {
        let buff = new Buffer(payload.body.data, "base64");
        content = buff.toString("ascii");
        // console.log(option);
        if (payload.mimeType === "text/html") {
          console.log(content);
        }
      } else {
        if (payload.parts[0].body.data) {
          console.log(option);
          let buff = new Buffer(payload.parts[1].body.data, "base64");
          content = buff.toString("ascii");
        }
      }
    }

    if (
      prevSender.length > 0 &&
      prevSender.includes(contact.email) &&
      isDuplicate
    ) {
      return filtered;
    }
    prevSender.push(contact.email);

    filtered.push({
      id,
      contact,
      sender,
      receiver,
      subject,
      snippet,
      time,
      content,
    });

    return filtered;
  }, []);

  let sortedEmail = reduce.slice().sort((a, b) => b.time - a.time);

  if (sort === "asc") {
    sortedEmail = reduce.slice().sort((a, b) => a.time - b.time);
  }

  return sortedEmail;
};

const addReceivedEmails = (emails) => {
  const newEmails = emails.slice().sort((a, b) => b.time - a.time);

  return newEmails.reduce((filtered, email) => {
    // console.log(email);
    const existing = filtered
      ? filtered.find((data) => data.contact.email === email.contact.email)
      : null;
    if (existing) {
      return filtered;
    }
    filtered.push(email);
    return filtered;
  }, []);
};

async function getEmails() {
  console.log("getting");
  const res = await myAxios.get("/getEmails");
  const data = await res.data;
  return data;
}

async function getMessages(email, userEmail) {
  const res = await myAxios.get(`/getMessages/${email}`);
  const data = await res.data;
  const sortedMessages = sortEmail(userEmail, data, false, "asc");
  return sortedMessages;
}

async function sendMessage(to, subject, message) {
  const res = await myAxios.post("/email", {
    to: to,
    subject: subject,
    message: message,
  });
  const data = await res.data;
  // alert(data.message);
  return data;
}

async function addNote(title, text, userID) {
  const res = await myAxios.post("/addNote", {
    title: title,
    text: text,
    userID: userID,
  });
  const data = await res.data;
  return data;
}

async function getNotes(userID) {
  const res = await myAxios.get(`/getNotes/${userID}`);
  const data = await res.data;
  return data;
}

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
  const [bubble, setBubble] = useState();
  const [isSending, setIsSending] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [showOptions, setShowOptions] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [todayNotes, setTodayNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState([]);

  const handleClose = (isShowNote = false) => {
    setNewEmail("");
    setNewMessage("");
    setNewSubject("");
    setShowNote(isShowNote);
    setShow(false);
  };

  useEffect(() => {
    getEmails().then((retrievedEmails) => {
      const sortedEmails = sortEmail(userInfo.email, retrievedEmails);
      setEmails(sortedEmails);
      console.log("useEff got it");
    });
    getNotes(userInfo.id).then((notes) => {
      console.log("notes?");
      setTodayNotes(notes);
      console.log(notes);
    });
  }, []);

  useEffect(() => {
    socket.connect();
    socket.on("private message", ({ content, from, to }) => {
      const user = connectedUsers.find((user) => user.userID === from);
      console.log("from pm", content);
      if (user && user.email === selectedEmail) {
        const chat = <ChatBubble key={content[0].id} message={content[0]} />;
        setBubble([...bubble, chat]);
      }
      content[0].time = new Date(content[0].time);
      content[0].contact = content[0].sender;
      const newEmails = addReceivedEmails(
        [...emails, content[0]],
        userInfo.email
      );
      setEmails(newEmails);
    });

    socket.on("users", (users) => {
      console.log("connected users retrieved");
      setConnectedUsers(users);
    });

    socket.on("user connected", (user) => {
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

    return () => {
      socket.off("users");
      socket.off("private message");
      socket.off("user connected");
      socket.off("user disconnected");
    };
  });

  const setSelectedContact = async (email, name) => {
    if (email !== selectedEmail) {
      setSelectedName(name);
      setSelectedEmail(email);
      setShowBody(true);

      setIsChatLoading(true);
      getMessages(email, userInfo.email).then((selectedMessages) => {
        const chat = selectedMessages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ));
        setBubble(chat);
        setIsChatLoading(false);
        console.log("chatloaded");
      });
    }
  };

  const chatBox = () => {
    return emails.reduce((filtered, email) => {
      const { id, contact, sender, receiver, subject, snippet, time } = email;

      if (sender.email !== receiver.email) {
        filtered.push(
          <ChatBox
            contact={contact.name}
            subject={subject ? subject.value : ""}
            snippet={snippet}
            receiver={receiver}
            onClick={setSelectedContact}
            email={contact.email}
            time={`${(time.getHours() < 10 ? "0" : "") + time.getHours()}:${
              (time.getMinutes() < 10 ? "0" : "") + time.getMinutes()
            }`}
            key={id}
          />
        );
      }
      return filtered;
    }, []);
  };

  const noteBox = () => {
    console.log("todayNotes", todayNotes);
    return todayNotes.reduce((filtered, note) => {
      const { id, text, title, updatedAt } = note;
      const time = new Date(updatedAt);
      filtered.push(
        <NoteBox
          noteId={id}
          title={title}
          text={text}
          time={`${(time.getHours() < 10 ? "0" : "") + time.getHours()}:${
            (time.getMinutes() < 10 ? "0" : "") + time.getMinutes()
          }`}
          onClick={setSelectedNote}
          key={id}
        />
      );
      return filtered;
    }, []);
  };

  const onSend = async (newEmail, newSubject, newMessage) => {
    console.log("sending");
    setIsSending(true);
    if (!selectedEmail && !newEmail) {
      alert("no email selected");
      setIsSending(false);
      return;
    }

    if (!message && !newEmail) {
      alert("Please enter a message");
      setIsSending(false);
      return;
    }
    const to = newEmail ? newEmail : selectedEmail;
    const messageSubject = newSubject ? newSubject : subject;
    const messageContent = newMessage ? newMessage : message;
    sendMessage(to, messageSubject, messageContent)
      .then((response) => {
        const email = sortEmail(
          userInfo.email,
          [response.messageSent],
          false,
          "asc"
        );
        if (selectedEmail === email[0].contact.email) {
          const oneBubble = <ChatBubble key={email[0].id} message={email[0]} />;
          setBubble([...bubble, oneBubble]);
        }

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

        setIsSending(false);
        handleClose();
      })
      .catch((error) => console.log(error));

    setMessage("");
  };

  const onAddNote = async (title, text) => {
    setIsAddingNote(true);
    addNote(title, text, userInfo.id).then((data) => {
      console.log(data);
      alert(`Note with the title: ${data.title} added!`);
      setShowNote(false);
      setIsAddingNote(false);
    });
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
            setShow={setShow}
            setShowOptions={setShowOptions}
          />
        </Col>
        <Col
          md={8}
          className="border-0 m-0 p-0 bg-light min-vh-100 d-flex flex-column"
        >
          {isChatLoading ? (
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(255,255,255,0.9)",
                zIndex: "10",
              }}
              className="d-flex justify-content-center align-items-center"
            >
              <Spinner
                as="span"
                animation="grow"
                size="xl"
                role="status"
                aria-hidden="true"
              />
            </div>
          ) : (
            ""
          )}
          <ChatBody
            onSubmit={onSend}
            receiverName={selectedName}
            receiverEmail={selectedEmail}
            message={message}
            setMessage={setMessage}
            isShowBody={showBody}
            setShowBody={setShowBody}
            bubble={bubble}
            isSending={isSending}
            setShow={setShow}
            setShowOptions={setShowOptions}
            setNewEmail={setNewEmail}
          />
        </Col>
      </Row>
      <NewEmail
        show={show}
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
        setShow={setShow}
        showNote={showNote}
        setShowNote={setShowNote}
        isAddingNote={isAddingNote}
        onSubmit={onAddNote}
      />
    </Container>
  );
};

export default Chat;
