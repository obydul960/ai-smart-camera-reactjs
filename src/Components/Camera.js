import React, { Component, Fragment, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import imagePlaceholder from "../assets/images/261694-200.png";
import Webcam from "react-webcam";
import SweetAlert from "react-bootstrap-sweetalert";

const Camera = () => {
  const cameraRef = React.createRef();
  const [capturedPhoto, setCapturedPhoto] = useState(imagePlaceholder);
  const [cameraError, setCameraError] = useState(false);
  // just get captchure picture
  const onCapture = async() => {
    setCapturedPhoto(cameraRef.current.getScreenshot());
  };
  
  //save get captchure pictur other div
  const onSave = async() => {
    let base64String = capturedPhoto;
    let a = document.createElement("a");
    a.href = base64String;
    a.download = "webCamp.jpeg";
    a.click();
  };
  //any error get
  const onCameraError = async() => {
    setCameraError(true);
  };
  //any error show sweet alert
  const cameraErrorAlert = async() => {
    if (cameraError === true) {
      return (
        <SweetAlert
          danger
          title="Device Camera Not Working"
          onConfirm={onCameraTryAgain}
        ></SweetAlert>
      );
    }
  };
// sweet alert popup message show compermation
  const onCameraTryAgain = async() => {
    window.location.href = "/";
  };

  return (
    <div>
      <Fragment>
        <Container>
          <Row className="mt-5 shadow-sm bg-white">
            <Col className="p-2" md={6} sm={12} lg={6}>
              <Webcam
                onUserMediaError={onCameraError}
                ref={cameraRef}
                className="w-100"
                audio={false}
                screenshotFormat="image/jpeg"
              />
              <button
                className="btn mt-3 btn-lg btn-primary"
                onClick={onCapture}
              >
                Capure
              </button>
            </Col>
            <Col className="p-2" md={6} sm={12} lg={6}>
              <img className="w-100" src={capturedPhoto} />
              <button onClick={onSave} className="btn mt-3 btn-lg btn-primary">
                Save
              </button>
            </Col>
          </Row>
        </Container>
        {cameraErrorAlert}
      </Fragment>ßß
    </div>
  );
};

export default Camera;
