import banner from "../../assets/banner.png";
import companies from "../../assets/comps.png";
import { Container, Row, Col } from "react-bootstrap";
import { AiFillPlayCircle } from "react-icons/ai";
import { Login } from "../../components/GoogleAuth";

const Welcome = () => {
  // const classes = useStyles();
  const preventDefault = (event) => event.preventDefault();
  return (
    <Container fluid className="px-5">
      <Row container spacing={2}>
        <Col lg={5} md={7}>
          <div>
            <h2 className={`mt-5 mb-3`}>Welcome to the future of email</h2>
          </div>
          <div>
            <p>
              Spike turns your email into simple, chat conversations, so you can
              work and collaborate seamlessly with clients and team members - in
              a more natural way.
            </p>
          </div>

          <div>
            <a href="/" onClick={preventDefault}>
              See how Spike Works <AiFillPlayCircle />
            </a>
          </div>
          <div>
            <form className="d-flex">
              <input
                type="text"
                className="form-control mr-2"
                placeholder="Enter your email"
                style={{
                  backgroundColor: "#f2f2f2",
                  borderStyle: "none",
                }}
                required
              />
              <Login text="Get Started" />
            </form>
          </div>
        </Col>
        <Col lg={7} md={5} className="d-flex mx-auto my-auto">
          <img
            src={banner}
            alt=""
            className="mt-3"
            style={{ width: "100%", height: "auto" }}
          />
        </Col>
      </Row>
      <Row container>
        <Col xs={12}>
          <h6 className="text-center">
            TRUSTED BY OVER 100,000 TEAMS WHO ALREADY TRANSFORMED THEIR WORKFLOW
          </h6>
          <img src={companies} alt="" className="d-flex mx-auto" />
        </Col>
      </Row>
    </Container>
  );
};

export default Welcome;
