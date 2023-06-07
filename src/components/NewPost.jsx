import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

const NewPost = ({ image }) => {


  const imgRef = useRef();
  const canvasRef = useRef();
  const { url, width, height } = image;


  const [faces, setFaces] = useState([]);
  const [friends, setFriends] = useState([]);

  const handleImage = async () => {
    const detections = await faceapi.detectAllFaces(
      imgRef.current,
      new faceapi.TinyFaceDetectorOptions());
    // .withFaceLandmarks()
    // .withFaceExpressions();
    // .withAgeAndGender();

    console.log(detections);
    setFaces(detections.map(d => Object.values(d.box)));
    // console.log(faces);

    // canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(imgRef.current);
    // faceapi.matchDimensions(canvasRef.current, {
    //   width,
    //   height,
    //   // width : "600",
    //   // height : "500",
    // })

    // const resized = faceapi.resizeResults(detections,{
    //   width,
    //   height,
    //   // width : "600",
    //   // height : "500",
    // })
    // faceapi.draw.drawDetections(canvasRef.current, resized);
    // faceapi.draw.drawFaceExpressions(canvasRef.current, resized);
    // faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
  };

  const enter = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineWidth = 5;
    ctx.strokeStyle = "green";
    faces.map((face) => ctx.strokeRect(...face));
  };

  useEffect(() => {
    const loadModels = () => {
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    // faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        
        // faceapi.nets.ageGenderNet.loadFromUri("/models"),
      ])
        .then(handleImage)
        .catch((e) => console.log(e));
    };

    // 
    imgRef.current && loadModels();
  }, []);

  const addFriend = (e) => {
    setFriends(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  console.log(friends);
  return (
    <div className="container">
      <div className="left" style={{width,height}}>
        <img ref={imgRef}
          crossOrigin="anonymous"
          src={url}
          className="leftImage"
          alt=""
        />
        <canvas onMouseEnter={enter} ref={canvasRef}
          width={width}
          height={height}
        />
        {faces.map((face, i) => (
          <input
            name={`input${i}`}
            style={{ left: face[0], top: (face[1] + face[3] + 5) }}
            placeholder="Tag a friend" key={i}
            className="friendInput"
            onChange={addFriend}
          />
        ))}
      </div>
      <div className="right">
        <h1>Share your Post</h1>
        <input
          type="text"
          placeholder="What's on your mind?"
          className="rightInput"
        />
        {friends && (
          <span 
          className="friends">
          with <span  
            className="name">
            {Object.values(friends) + " "}
          </span>
        </span>
        )}
        <button className="rightButton">Send</button>
      </div>
    </div>
  )
}

export default NewPost

