import { useState } from "react";
import { HiUserGroup } from "react-icons/hi";
import {
  FaRocket,
  FaHome,
  FaBook,
  FaBasketballBall,
  FaWineGlassAlt,
  FaUmbrellaBeach,
  FaPencilAlt,
} from "react-icons/fa";
import { Card, Button } from "react-bootstrap";

const GroupBox = ({ category, onClick, groupChat, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleSelectGroup = () => {
    if (groupChat) {
      onSelect(groupChat);
    } else {
      onClick(category);
    }
  };

  const categories = [
    { categoryName: "Project", icon: <FaRocket /> },
    { categoryName: "Family", icon: <FaHome /> },
    { categoryName: "Study Group", icon: <FaBook /> },
    { categoryName: "Sports Group", icon: <FaBasketballBall /> },
    { categoryName: "Party", icon: <FaWineGlassAlt /> },
    { categoryName: "Vacation", icon: <FaUmbrellaBeach /> },
    { categoryName: "", icon: <HiUserGroup /> },
  ];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className="rounded-0 border-0 p-3"
        id="chat-box"
        onClick={handleSelectGroup}
      >
        <div className="d-flex">
          <div className="mr-3 my-auto">
            <div
              className="rounded-circle bg-primary d-flex justify-content-center align-items-center"
              style={{ width: "40px", height: "40px" }}
            >
              <h5 className="p-0 m-0">
                {groupChat
                  ? categories[groupChat.category].icon
                  : categories[category].icon}
              </h5>
            </div>
          </div>
          <div style={{ lineHeight: "1rem" }}>
            <h6 className="m-0">
              {groupChat ? groupChat.name : categories[category].categoryName}
            </h6>
            <small className={`${groupChat ? "d-block" : "d-none"}`}>
              {groupChat ? groupChat.members.length + 1 : ""} Members
            </small>
          </div>
        </div>
      </Card>
      {groupChat ? (
        <Button
          variant="light"
          className={`position-absolute rounded-circle shadow-none justify-content-center align-items-center h6 p-0 ${
            isHovered ? "d-flex" : "d-none"
          }`}
          style={{
            right: "3%",
            transform: "translateY(-220%)",
            width: "30px",
            height: "30px",
            zIndex: "9",
          }}
          onClick={() => onClick(groupChat)}
        >
          <FaPencilAlt />
        </Button>
      ) : (
        ""
      )}
    </div>
  );
};

export default GroupBox;
