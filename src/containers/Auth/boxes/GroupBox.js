import React from "react";
import { GrNotes } from "react-icons/gr";
import {
  FaRocket,
  FaHome,
  FaBook,
  FaBasketballBall,
  FaWineGlassAlt,
  FaUmbrellaBeach,
} from "react-icons/fa";
import { Card } from "react-bootstrap";
import { getTimeFromDate } from "../../../components/GlobalHelpers";

const GroupBox = ({ category }) => {
  //   const { category } = group;
  console.log(category);
  const time = new Date();
  function removeTags(str) {
    if (str === null || str === "") return false;
    else str = str.toString();

    return str.replace(/(<([^>]+)>)/gi, "");
  }
  const categories = [
    { categoryName: "Project", icon: <FaRocket /> },
    { categoryName: "Family", icon: <FaHome /> },
    { categoryName: "Study Group", icon: <FaBook /> },
    { categoryName: "Sports Group", icon: <FaBasketballBall /> },
    { categoryName: "Party", icon: <FaWineGlassAlt /> },
    { categoryName: "Vacation", icon: <FaUmbrellaBeach /> },
  ];
  console.log(categories);
  return (
    <Card className="rounded-0 border-0 p-3" id="chat-box">
      <div className="d-flex">
        <div className="mr-3 my-auto">
          <div
            className="rounded-circle bg-primary d-flex justify-content-center align-items-center"
            style={{ width: "40px", height: "40px" }}
          >
            <h5 className="p-0 m-0">{categories[category].icon}</h5>
          </div>
        </div>
        <div style={{ lineHeight: "1rem" }}>
          <h6 className="m-0">{categories[category].categoryName}</h6>
          {/* <small className="d-block">Note</small> */}
        </div>
        {/* <div className="ml-auto">
          <small>{getTimeFromDate(time)}</small>
        </div> */}
      </div>
    </Card>
  );
};

export default GroupBox;
