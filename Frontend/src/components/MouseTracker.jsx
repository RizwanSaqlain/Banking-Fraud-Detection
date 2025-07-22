import { useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function MouseTracker() {
  const movementBuffer = useRef([]);
  const sessionStart = useRef(Date.now());

  useEffect(() => {
    // Generate a consistent sessionId for this session
    // const sessionId = ${sessionStart.current.toString(36)}${Math.floor(Math.random() * 10)};

    const handleMouseMove = (e) => {
      const time_ms = Date.now() - sessionStart.current;
      movementBuffer.current.push({ time_ms, x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Send every 30 seconds to Flask backend
    const uploadInterval = setInterval(async () => {
      if (movementBuffer.current.length > 0) {
        const events = [...movementBuffer.current];
        movementBuffer.current = [];
        // console.log("Sending events to backend:", events);
        try {
          const res = await axios.post(
            "http://localhost:5001/analyze-mouse",
            {
              events,
            },
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
      }
    }, 10000); // 30 seconds

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(uploadInterval);
    };
  }, []);

  return null;
}
