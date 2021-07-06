import { Container } from "react-bootstrap";
import Welcome from "./Welcome";
import Second from "./Second";
import Placeholder from "../../components/Placeholder";

const Home = () => {
  return (
    <>
      <Container fluid className="mt-5">
        <Welcome />
      </Container>
      <Container fluid style={{ backgroundColor: "black" }}>
        <Second />
      </Container>
      <Container fluid>
        <Placeholder theme="light" title="Third Container" />
      </Container>
    </>
  );
};

export default Home;
