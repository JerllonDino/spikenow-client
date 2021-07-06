import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Placeholder = ({ theme, title }) => {
  let items = [];

  for (let index = 0; index < 13; index++) {
    items.push(
      <Row
        key={index}
        style={{
          height: "10px",
          backgroundColor: theme === "light" ? "lightgrey" : "white",
        }}
        className="my-3"
      ></Row>
    );
  }

  return (
    <Container>
      {title ? (
        <Row style={{ marginTop: "100px" }}>
          <Col xs={12}>
            <h1 className="text-center text-dark display-3">{title}</h1>
          </Col>
        </Row>
      ) : (
        ""
      )}
      <Row className="my-5">
        <Col lg={6} className="px-4">
          <Row>
            <Col
              style={{
                height: "500px",
                backgroundColor: theme === "light" ? "lightgrey" : "white",
              }}
            ></Col>
          </Row>
          <Row>
            <Col
              style={{
                height: "10px",
                backgroundColor: theme === "light" ? "lightgrey" : "white",
              }}
              className="my-4"
            ></Col>
          </Row>
        </Col>
        <Col lg={6} className="px-4">
          {items}
        </Col>
      </Row>
    </Container>
  );
};

export default Placeholder;
