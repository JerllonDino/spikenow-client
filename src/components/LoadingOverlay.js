import React from "react";
import { Spinner } from "react-bootstrap";

const LoadingOverlay = ({ isLoading }) => {
  return (
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
      className={`${
        isLoading ? "d-flex" : "d-none"
      } justify-content-center align-items-center`}
    >
      <Spinner
        as="span"
        animation="grow"
        size="xl"
        role="status"
        aria-hidden="true"
      />
    </div>
  );
};

export default LoadingOverlay;
