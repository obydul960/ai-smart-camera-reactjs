import React, { Component, Fragment } from "react";
import { Col, Container, Row } from "react-bootstrap";
import imagePlaceholder from "../assets/images/261694-200.png";
import Webcam from "react-webcam";
import SweetAlert from "react-bootstrap-sweetalert";

class Camera extends Component {
  constructor() {
    super();
    this.cameraRef = React.createRef();
    this.state = {
      capturedPhoto: imagePlaceholder,
      cameraError: false,
    };
  }
  onCapture = () => {
    
    let poto64String = this.cameraRef.current.getScreenshot();
    this.setState({ capturedPhoto: poto64String });
  };
  onSave = () => {
    let base64String = this.state.capturedPhoto;
    let a = document.createElement("a");
    a.href = base64String;
    a.download = "webCamp.jpeg";
    a.click();
  };

  cameraErrorAlert = () => {
    if (this.state.cameraError === true) {
      return (
        <SweetAlert
          danger
          title="Device Camera Not Working"
          onConfirm={this.onCameraTryAgain}
        >
          You clicked the button!
        </SweetAlert>
      );
    }
  };

  onCameraError = () => {
    this.setState({cameraError:true});
  }

  onCameraTryAgain = () => {
    window.location.href="/";
  }
  render() {
    return (
      <div>
        <Fragment>
          <Container>
            <Row className="mt-5 shadow-sm bg-white">
              <Col className="p-2" md={6} sm={12} lg={6}>
                <Webcam
                  onUserMediaError={this.onCameraError}
                  ref={this.cameraRef}
                  className="w-100"
                  audio={false}
                  screenshotFormat="image/jpeg"
                />
                <button
                  className="btn mt-3 btn-lg btn-primary"
                  onClick={this.onCapture}
                >
                  Capure
                </button>
              </Col>
              <Col className="p-2" md={6} sm={12} lg={6}>
                <img className="w-100" src={this.state.capturedPhoto} />
                <button onClick={this.onSave} className="btn mt-3 btn-lg btn-primary">Save</button>
              </Col>
            </Row>
          </Container>
          {this.cameraErrorAlert}
        </Fragment>
      </div>
    );
  }
}

export default Camera;
