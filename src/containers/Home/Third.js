import React from "react";
import { Container } from "react-bootstrap";
import Placeholder from "../../components/Placeholder";

const Third = () => {
  return (
    <>
      <Container className="my-5">
        <h1 style={{ textAlign: "center" }}>Third Container</h1>
      </Container>
      <Placeholder theme="light" />
    </>
  );
};

export default Third;
