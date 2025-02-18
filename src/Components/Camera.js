import * as faceapi from "face-api.js";
import React, { Component, Fragment, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import imagePlaceholder from "../assets/images/261694-200.png";
import Webcam from "react-webcam";
import SweetAlert from "react-bootstrap-sweetalert";
import ReactJson from "react-json-view";

const Camera = () => {
  const cameraRef = React.createRef();
  const [capturedPhoto, setCapturedPhoto] = useState(imagePlaceholder);
  const [cameraError, setCameraError] = useState(false);
  const [ageAndGender, setAgeAndGender] = useState([]);
  const [userFaceExpression, setUserFaceExpression] = useState([]);
  const [getFaceExp, setGetFaceExp] = useState("");
  const [userAge, setUserAge] = useState();
  const [userGender, setUserGender] = useState();
  const age = "";
  const gender = "";
  console.log("ageAndGender ===", ageAndGender);
  // just get captchure picture
  const onCapture = async () => {
    setCapturedPhoto(cameraRef.current.getScreenshot());
  };

  //save get captchure pictur other div
  const onSave = async () => {
    let base64String = capturedPhoto;
    let a = document.createElement("a");
    a.href = base64String;
    a.download = "webCamp.jpeg";
    a.click();
  };
  //any error get
  const onCameraError = async () => {
    setCameraError(true);
  };
  //any error show sweet alert
  const cameraErrorAlert = async () => {
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
  const onCameraTryAgain = async () => {
    window.location.href = "/";
  };

  //age and gender define
  async function ageAndGenderDetection() {
    await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
    await faceapi.nets.ageGenderNet.loadFromUri("/models");
    var images = document.getElementById("first-img");
    const getAgeAndGender = await faceapi
      .detectAllFaces(images)
      .withAgeAndGender();
    setAgeAndGender(getAgeAndGender);
  }

  async function onFaceExpression() {
    await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
    await faceapi.nets.faceExpressionNet.loadFromUri("/models");
    var images = document.getElementById("first-img");
    let getFaceExpression = await faceapi
      .detectAllFaces(images)
      .withFaceExpressions();

    let neutral = getFaceExpression[0]["expressions"]["neutral"] + 0.1;
    let happy = getFaceExpression[0]["expressions"]["happy"] + 0.1;
    let sad = getFaceExpression[0]["expressions"]["sad"] + 0.1;
    let angry = getFaceExpression[0]["expressions"]["angry"] + 0.1;
    let fearful = getFaceExpression[0]["expressions"]["fearful"] + 0.1;
    let disgusted = getFaceExpression[0]["expressions"]["disgusted"] + 0.1;
    let surprised = getFaceExpression[0]["expressions"]["surprised"] + 0.1;
    
    if (neutral > 0.9 && neutral < 1.2) {
      setGetFaceExp("neutral");
    } else if (happy > 0.9 && happy < 1.2) {
      setGetFaceExp("happy");
    } else if (sad > 0.9 && sad < 1.2) {
      setGetFaceExp("sad");
    } else if (angry > 0.9 && angry < 1.2) {
      setGetFaceExp("angry");
    } else if (fearful > 0.9 && fearful < 1.2) {
      setGetFaceExp("fearful");
    } else if (disgusted > 0.9 && disgusted < 1.2) {
      setGetFaceExp("disgusted");
    } else if (surprised > 0.9 && surprised < 1.2) {
      setGetFaceExp("surprised");
    } else {
      setGetFaceExp("Null");
    }
    setUserFaceExpression(getFaceExpression);
  }

  const damiJson = [{ name: "Demo one", Age: 25 }];

  return (
    <div>
      <Fragment>
        <Container>
          <Row className="mt-5 shadow-sm bg-white">
            <Col className="p-2 text-center" md={4} sm={12} lg={4}>
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
            <Col className="p-2 text-center" md={4} sm={12} lg={4}>
              <img id="first-img" className="w-100 img" src={capturedPhoto} />
              <button onClick={onSave} className="btn mt-3 btn-lg btn-primary">
                Save
              </button>
            </Col>
            <Col className="p-2 text-center" md={4} sm={12} lg={4}>
              <p>Age : {userAge}</p>
              <p>Gender : {userGender}</p>
              <p>Expression : {getFaceExp}</p>
            </Col>
          </Row>
        </Container>

        <Container>
          <Row>
            <Col className="p-2" sm={12} md={6} lg={6}>
              <h2>Face Landmrk</h2>
              <button
                onClick={ageAndGenderDetection}
                className="btn mt-3 btn-lg btn-primary"
              >
                Get Age & Gender
              </button>
              <ReactJson src={ageAndGender} theme="monokai" />
            </Col>
            <Col className="p-2" sm={12} md={6} lg={6}>
              <h2>Face Expression</h2>
              <button
                onClick={onFaceExpression}
                className="btn mt-3 btn-lg btn-primary"
              >
                Get Face Expression
              </button>
              <ReactJson src={userFaceExpression} theme="monokai" />
            </Col>
            <Col className="p-2" sm={12} md={6} lg={6}>
              <h2>Age Estami</h2>
              <ReactJson src={damiJson} theme="monokai" />
            </Col>
            <Col className="p-2" sm={12} md={6} lg={6}>
              <h2>Gender Recognition</h2>
              <ReactJson src={damiJson} theme="monokai" />
            </Col>
          </Row>
        </Container>
        {cameraErrorAlert}
      </Fragment>
      ßß
    </div>
  );
};

export default Camera;
