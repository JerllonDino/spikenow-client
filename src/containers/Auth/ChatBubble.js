import { useContext } from "react";
import { AuthorizedUserContext } from "../../components/AuthorizedRoutes";
import { Card } from "react-bootstrap";

const ChatBubble = ({ message }) => {
  const { userInfo } = useContext(AuthorizedUserContext);
  const { id, contact, sender, receiver, subject, snippet, time, content } =
    message;
  return (
    <Card
      className={`p-1 text-dark my-2 bg-light d-flex flex-nowrap ${
        sender.email === userInfo.email
          ? "align-self-end align-items-end"
          : "align-self-start align-items-start"
      }`}
      style={{
        minWidth: "25%",
        maxWidth: "90%",
        wordBreak: "break-word",
      }}
    >
      <h6>{subject ? subject.value : ""}</h6>
      <div dangerouslySetInnerHTML={{ __html: content }}></div>
      {/* <p>{content}</p> */}
    </Card>
  );
};

export default ChatBubble;
