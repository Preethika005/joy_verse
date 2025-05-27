import { useEffect, useRef, useState } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

const emotionThemes = {
  Happy: "url('https://img.freepik.com/free-photo/beautiful-natural-landscape_23-2151839255.jpg?uid=R130019136&ga=GA1.1.180083328.1743690065&semt=ais_hybrid&w=740')",
  Sad: "url('https://img.freepik.com/free-photo/pathway-middle-green-leafed-trees-with-sun-shining-through-branches_181624-4539.jpg?uid=R130019136&ga=GA1.1.180083328.1743690065&semt=ais_hybrid&w=740')",
  Angry: "url('https://img.freepik.com/free-photo/beautiful-landscape-view-ocean_23-2149119440.jpg?uid=R130019136&ga=GA1.1.180083328.1743690065&semt=ais_hybrid&w=740')",
  Surprise: "url('https://img.freepik.com/free-vector/aurora-realistic-night-background_1284-69939.jpg?uid=R130019136&ga=GA1.1.180083328.1743690065&semt=ais_hybrid&w=740')",
  Neutral: "url('https://img.freepik.com/premium-photo/man-fishing-boat-near-tree-blue-water-lake-is-very-smooth_42764-132.jpg?uid=R130019136&ga=GA1.1.180083328.1743690065&semt=ais_hybrid&w=740')",
};

const useEmotionDetection = ({ intervalTime = 5000, apiUrl = "http://localhost:5000/predict" } = {}) => {
  const [emotion, setEmotion] = useState("Neutral");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const lastPredictionTime = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!video || !canvas || !ctx) return;

    const faceMesh = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults(async (results) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const landmarksArray = results.multiFaceLandmarks[0];

        // Draw landmarks
        for (const point of landmarksArray) {
          ctx.beginPath();
          ctx.arc(point.x * canvas.width, point.y * canvas.height, 2, 0, 2 * Math.PI);
          ctx.fillStyle = "red";
          ctx.fill();
        }

        const now = Date.now();
        if (now - lastPredictionTime.current >= intervalTime) {
          lastPredictionTime.current = now;

          // Preprocessing
          const landmarkPoints = landmarksArray.map(pt => [pt.x * canvas.width, pt.y * canvas.height]);
          const baseX = landmarkPoints[0][0];
          const baseY = landmarkPoints[0][1];
          const relativePoints = landmarkPoints.map(([x, y]) => [x - baseX, y - baseY]);
          const flatPoints = relativePoints.flat();
          const maxAbs = Math.max(...flatPoints.map(Math.abs));
          const normalized = flatPoints.map(val => val / maxAbs);

          try {
            const response = await fetch(apiUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ landmarks: normalized }),
            });
            const data = await response.json();
            if (data.emotion) {
              const normalizedEmotion = data.emotion.charAt(0).toUpperCase() + data.emotion.slice(1).toLowerCase();
              setEmotion(normalizedEmotion);
            }
          } catch (err) {
            console.error("Prediction error:", err);
          }
        }
      }
    });

    const camera = new Camera(video, {
      onFrame: async () => {
        await faceMesh.send({ image: video });
      },
      width: 640,
      height: 480,
    });

    camera.start();

    return () => {
      camera.stop();
    };
  }, []);

  useEffect(() => {
    const bgImage = emotionThemes[emotion];
    document.body.style.setProperty("transition", "background-image 1s ease-in-out", "important");
    document.body.style.setProperty("background-image", bgImage || "none", "important");
    document.body.style.setProperty("background-size", "cover", "important");
    document.body.style.setProperty("background-position", "center", "important");
    document.body.style.setProperty("background-repeat", "no-repeat", "important");
    document.body.style.setProperty("width", "100%");
    document.body.style.setProperty("height", "100%");
  }, [emotion]);

  return { emotion, videoRef, canvasRef };
};

export default useEmotionDetection;