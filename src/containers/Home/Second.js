import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import video1 from "../../assets/01_Hero_Convo_.webm";

// const useStyles = makeStyles({
//   root: {
//     color: "white",
//   },
//   title: {
//     fontWeight: 700,
//     lineHeight: 1,
//     textAlign: "center",
//     fontSize: "4.5rem",
//   },
// });

const Second = () => {
  // const classes = useStyles();
  return (
    <Container className={`mt-5 text-white`}>
      <Row className="justify-content-center">
        <Col lg={10} className="py-5">
          <h1 className="text-center">Email that puts people first</h1>
          <p className="mt-5 text-center">
            Conversational email removes stiff formalities, letting you
            communicate like a human again. No more confusing threads—just
            natural, flowing dialogue for an improved workflow. It's email, but
            as easy as chat.
          </p>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col lg={10} className="py-5">
          <Row>
            <Col lg={6}>
              <video src={video1} playsInline loop></video>
            </Col>
            <Col lg={6}>
              <h2>Talk to people. </h2>
              <h2>Not threads. </h2>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Second;
