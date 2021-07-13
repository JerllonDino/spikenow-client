import { useContext, useState, useEffect } from "react";
import { AuthorizedUserContext } from "../../components/AuthorizedRoutes";
import { Card } from "react-bootstrap";
import { FaStar, FaRegStar, FaRegTrashAlt } from "react-icons/fa";
import { starEmail, trashEmail } from "./helpers/ChatHelpers";

const ChatBubble = ({ message, filterBubble }) => {
  const { userInfo } = useContext(AuthorizedUserContext);
  const [isShowOptions, setIsShowOptions] = useState(false);
  const [isStar, setIsStar] = useState(false);
  const {
    id,
    contact,
    sender,
    receiver,
    subject,
    snippet,
    time,
    content,
    labelIds,
  } = message;

  useEffect(() => {
    const findStar = labelIds.find((label) => label === "STARRED");
    if (findStar) {
      setIsStar(true);
    } else {
      setIsStar(false);
    }
  }, [labelIds]);

  const handleStar = () => {
    starEmail(id, !isStar).then((data) => {
      console.log(data);
      setIsStar(!isStar);
    });
  };

  const handleTrash = () => {
    filterBubble(id);
    trashEmail(id).then((data) => {
      console.log(data);
    });
  };

  return (
    <div
      className={`d-flex flex-nowrap ${
        sender.email === userInfo.email ? "flex-row-reverse" : "flex-row"
      }`}
      onMouseEnter={() => setIsShowOptions(true)}
      onMouseLeave={() => setIsShowOptions(false)}
    >
      <Card
        className={`p-1 text-dark my-2 bg-light d-flex flex-nowrap ${
          sender.email === userInfo.email
            ? "align-items-end"
            : "align-items-start"
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
      <div
        className={`${
          !isShowOptions ? "d-none" : "d-flex"
        }  flex-row mt-3 mx-2`}
      >
        {isStar ? (
          <FaStar
            className="mx-1"
            style={{ cursor: "pointer" }}
            onClick={handleStar}
          />
        ) : (
          <FaRegStar
            className="mx-1"
            style={{ cursor: "pointer" }}
            onClick={handleStar}
          />
        )}
        <FaRegTrashAlt
          className="mx-1"
          style={{ cursor: "pointer" }}
          onClick={handleTrash}
        />
      </div>
    </div>
  );
};

export default ChatBubble;
