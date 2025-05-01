import React, { useRef, useEffect } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

const FaceMeshPage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const faceMesh = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results) => {
      const canvasCtx = canvasRef.current.getContext("2d");
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

      if (results.multiFaceLandmarks) {
        results.multiFaceLandmarks.forEach((landmarks) => {
          canvasCtx.fillStyle = "red";
          landmarks.forEach((point) => {
            canvasCtx.beginPath();
            canvasCtx.arc(point.x * canvasRef.current.width, point.y * canvasRef.current.height, 2, 0, 2 * Math.PI);
            canvasCtx.fill();
          });
        });
      }
    });

    const startCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((error) => console.error("Video play error:", error));

      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await faceMesh.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });

      camera.start();
    };

    startCamera();

    return () => {
      faceMesh.close();
    };
  }, []);

  return (
    <div>
      <h1>Real-Time Face Mesh Detection</h1>
      <video ref={videoRef} style={{ display: "none" }} />
      <canvas ref={canvasRef} width={640} height={480} style={{ border: "2px solid black" }} />
    </div>
  );
};

export default FaceMeshPage;
