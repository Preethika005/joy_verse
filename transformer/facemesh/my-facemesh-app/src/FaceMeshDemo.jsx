import { useEffect, useRef, useState } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

export default function FaceMeshDemo() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [emotion, setEmotion] = useState("");
  const lastPredictionTime = useRef(0); // store last prediction time

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

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

    // Throttle prediction
    const now = Date.now();
    if (now - lastPredictionTime.current >= 2000) {
      lastPredictionTime.current = now;

      // === Preprocess landmarks: match training input ===
      // Step 1: Convert from normalized image coords to pixel values
      const landmarkPoints = landmarksArray.map(pt => [pt.x * canvas.width, pt.y * canvas.height]);

      // Step 2: Relative coordinates (subtract base point)
      const baseX = landmarkPoints[0][0];
      const baseY = landmarkPoints[0][1];
      const relativePoints = landmarkPoints.map(([x, y]) => [x - baseX, y - baseY]);

      // Step 3: Flatten
      const flatPoints = relativePoints.flat();

      // Step 4: Normalize
      const maxAbs = Math.max(...flatPoints.map(Math.abs));
      const normalized = flatPoints.map(val => val / maxAbs);

      try {
        const res = await fetch("http://localhost:5000/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ landmarks: normalized }),
        });
        const data = await res.json();
        setEmotion(data.emotion || "Unknown");
      } catch (error) {
        console.error("Prediction error:", error);
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
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Detected Emotion: {emotion}</h2>
      <video ref={videoRef} autoPlay className="hidden" />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{ border: "1px solid black" }}
      />
    </div>
  );
}
