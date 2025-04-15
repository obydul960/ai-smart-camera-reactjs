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
  const [userFaceLandmark, setUserFaceLandmark] = useState([]);
  const [lerfToRightEye, setLerfToRightEye] = useState("0");
  const [noseToLeftMouth, setNoseToLeftMouth] = useState("0");
  const [noseToRightMouth, setNoseToRightMouth] = useState("0");
  const [noseToLeftEye, setNoseToLeftEye] = useState("0");
  const [noseToRightEye, setNoseToRightEye] = useState("0");
  
  const [getFaceExp, setGetFaceExp] = useState("");
  const [userAge, setUserAge] = useState();
  const [userGender, setUserGender] = useState();
  const age = "";
  const gender = "";
  console.log("ageAndGender ===", ageAndGender);

    //save get captchure pictur other div
    const onSave = async () => {
      let base64String = capturedPhoto;
      let a = document.createElement("a");
      a.href = base64String;
      a.download = "webCamp.jpeg";
      a.click();
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

  //any error get
  const onCameraError = async () => {
    setCameraError(true);
  };


  // just get captchure picture
  const onCapture = async () => {
    setCapturedPhoto(cameraRef.current.getScreenshot());
    setTimeout(function(){
      overallFaceAnalicis();
    },1000)
  };

  const onLerfToRightEye = async (userFaceLandmark) => {
    // distance = Math.sqrt((x2 - x1)^2 + (y2 - y1)^2)
    let x1 = userFaceLandmark['landmarks']['_positions'][37]['_x'];
    let y1 = userFaceLandmark['landmarks']['_positions'][37]['_y'];
    let x2 = userFaceLandmark['landmarks']['_positions'][46]['_x'];
    let y2 = userFaceLandmark['landmarks']['_positions'][46]['_y'];

    let distance = Math.sqrt((Math.pow((x2-x1),2)) + (Math.pow((y2-y1),2)));
    setLerfToRightEye(distance);

  }
  const onNoseToLeftMouth = async (userFaceLandmark) => {
    let x1 = userFaceLandmark['landmarks']['_positions'][31]['_x'];
    let y1 = userFaceLandmark['landmarks']['_positions'][31]['_y'];
    let x2 = userFaceLandmark['landmarks']['_positions'][49]['_x'];
    let y2 = userFaceLandmark['landmarks']['_positions'][49]['_y'];

    let distance = Math.sqrt((Math.pow((x2-x1),2)) + (Math.pow((y2-y1),2)));
    setNoseToLeftMouth(distance);

  }
  const onNoseToRightMouth = async (userFaceLandmark) => {
    let x1 = userFaceLandmark['landmarks']['_positions'][31]['_x'];
    let y1 = userFaceLandmark['landmarks']['_positions'][31]['_y'];
    let x2 = userFaceLandmark['landmarks']['_positions'][55]['_x'];
    let y2 = userFaceLandmark['landmarks']['_positions'][55]['_y'];
    let distance = Math.sqrt((Math.pow((x2-x1),2)) + (Math.pow((y2-y1),2)));
    setNoseToRightMouth(distance);

  }
  const onNoseToLeftEye = async (userFaceLandmark) => {
    let x1 = userFaceLandmark['landmarks']['_positions'][31]['_x'];
    let y1 = userFaceLandmark['landmarks']['_positions'][31]['_y'];
    let x2 = userFaceLandmark['landmarks']['_positions'][37]['_x'];
    let y2 = userFaceLandmark['landmarks']['_positions'][37]['_y'];
    let distance = Math.sqrt((Math.pow((x2-x1),2)) + (Math.pow((y2-y1),2)));
    setNoseToLeftEye(distance);

  }
  const onNoseToRightEye = async (userFaceLandmark) => {
    let x1 = userFaceLandmark['landmarks']['_positions'][31]['_x'];
    let y1 = userFaceLandmark['landmarks']['_positions'][31]['_y'];
    let x2 = userFaceLandmark['landmarks']['_positions'][46]['_x'];
    let y2 = userFaceLandmark['landmarks']['_positions'][46]['_y'];
    let distance = Math.sqrt((Math.pow((x2-x1),2)) + (Math.pow((y2-y1),2)));
    setNoseToRightEye(distance);

  }
//overall faceAnalicsis
const overallFaceAnalicis = () => {
  ageAndGenderDetection();
  onFaceExpression();
  onLandmarkDectation();
}




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

  //onFace analysis
  async function onFaceAnalysis() {
    await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
    await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    await faceapi.nets.faceExpressionNet.loadFromUri("/models");
    await faceapi.nets.ageGenderNet.loadFromUri("/models");
    const imageID = document.getElementById("first-img");
    const detection = await faceapi.detectSingleFace(imageID)
    .withFaceLandmarks()
    .withFaceExpressions()
    .withAgeAndGender();

    //get age and gender
    let age = (detection['age']).toFixed(0);
    let gender = (detection['gender']);
    setUserAge(age);
    setUserGender(gender);

    // Landamark Distances...
    onLerfToRightEye(detection);
    onNoseToLeftMouth(detection);
    onNoseToRightMouth(detection);
    onNoseToLeftEye(detection);
    onNoseToRightEye(detection);

    
  }
//face expression
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


  // face landmark 
  async function onLandmarkDectation() {
    await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
    await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    var images = document.getElementById("first-img");
    let getFaceLandMark = await faceapi
      .detectAllFaces(images)
      .withFaceLandmarks();
      setUserFaceLandmark(getFaceLandMark);
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
              <p>Lerf  To Right Eye : {lerfToRightEye || 0}</p>
              <p>Nose To Left Mouth : {noseToLeftMouth || 0}</p>
              <p>Nose To Right Mouth : {noseToRightMouth || 0}</p>
              <p>Nose To Left Eye : {noseToLeftEye || 0}</p>
              <p>Nose To Right Eye : {noseToRightEye || 0}</p>
            </Col>
          </Row>
        </Container>

        <Container>
          <Row>
            <Col className="p-2" sm={12} md={6} lg={6}>
              <h2>Face Landmrk</h2>
              <button
                onClick={onFaceAnalysis}
                className="btn mt-3 btn-lg btn-primary"
              >
                Face Analysis
              </button>
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
              <h2>User Face Landmark</h2>
              <button
                onClick={onLandmarkDectation}
                className="btn mt-3 btn-lg btn-primary"
              >
                Get Face Landmrk
              </button>
              <ReactJson src={userFaceLandmark} theme="monokai" />
            </Col>
            <Col className="p-2" sm={12} md={6} lg={6}>
              <h2>Gender Recognition</h2>
              <ReactJson src={damiJson} theme="monokai" />
            </Col>
          </Row>
        </Container>
        {cameraErrorAlert}
      </Fragment>
      
    </div>
  );
};

export default Camera;
