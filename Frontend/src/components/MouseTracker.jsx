import { useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function MouseTracker() {
  const movementBuffer = useRef([]);
  const sessionStart = useRef(Date.now());
  const lastCaptureTime = useRef(0);

  // Change this value to adjust upload interval (in ms)
  const UPLOAD_INTERVAL_MS = 10000; // 10 seconds

  useEffect(() => {
    const sessionId = `${sessionStart.current.toString(36)}${Math.floor(Math.random() * 10)}`;

    const handleMouseMove = (e) => {
      const now = Date.now();
      if (now - lastCaptureTime.current >= 200) {
        const time_ms = now - sessionStart.current;
        movementBuffer.current.push({ time_ms, x: e.clientX, y: e.clientY });
        lastCaptureTime.current = now;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    const uploadInterval = setInterval(async () => {
      if (movementBuffer.current.length > 0) {
        const events = [...movementBuffer.current];
        const events = [...movementBuffer.current];
        movementBuffer.current = [];

        // Send to analysis backend
        try {
          const res = await axios.post(
            "http://localhost:5001/analyze-mouse",
            events,
            {
              withCredentials: true,
              headers: { "Content-Type": "application/json" },
            }
          );
          const { anomaly_score, is_anomaly } = res.data;
          console.log("Anomaly Score:", anomaly_score);
          if (is_anomaly) {
            console.warn("⚠ Suspicious cursor behavior detected!");
            toast.warning("Suspicious cursor behavior detected!");
          }
        } catch (err) {
          console.error("Error analyzing mouse movement:", err);
        }

        // Send to saving backend
        try {
          await axios.post(
            "http://localhost:5000/api/cursor-events",
            { sessionId, events },
            { headers: { "Content-Type": "application/json" } }
          );
        } catch (err) {
          console.error("Error saving cursor events:", err);
        }
      }
    }, UPLOAD_INTERVAL_MS);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(uploadInterval);
    };
  }, []);

  return null;
}
