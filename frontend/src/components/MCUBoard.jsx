import { useEffect, useState } from "react";
import api from "../services/api";
import Pin from "./Pin";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MCUBoard() {
  const [pins, setPins] = useState([]);

  useEffect(() => {
    fetchPins();
  }, []);

  const fetchPins = async () => {
    try {
      const res = await api.get("/api/pins");
      setPins(res.data);
    } catch {
      toast.error("Failed to fetch pins");
    }
  };

  const lockPin = async (pin) => {
    if (pin.locked) return;

    try {
      const res = await api.patch(`/api/pins/${pin.id}`);

      setPins((prev) =>
        prev.map((p) =>
          p.id === pin.id
            ? {
                ...p,
                locked: true,
              }
            : p
        )
      );

      toast.success(res.data.message, {
        autoClose: 5000,
      });
    } catch (err) {
      toast.error(
        err.response?.data?.detail || "Failed to lock pin"
      );
    }
  };

  const leftPins = pins
    .filter((p) => p.side === "left")
    .sort((a, b) => a.position - b.position);

  const rightPins = pins
    .filter((p) => p.side === "right")
    .sort((a, b) => a.position - b.position);

  const boardHeight =
    Math.max(leftPins.length, rightPins.length) * 60 + 120;

  return (
    <>
      <div className="bg-gray-100 rounded-xl p-6 shadow-2xl">
        <svg
          width="900"
          height={boardHeight}
          viewBox={`0 0 900 ${boardHeight}`}
        >
          <rect
            x="150"
            y="50"
            width="600"
            height={boardHeight - 100}
            fill="white"
            stroke="black"
            strokeWidth="4"
          />

          <rect
            x="360"
            y={boardHeight / 2 - 60}
            width="180"
            height="120"
            fill="black"
            stroke="#64748b"
          />

          <text
            x="450"
            y={boardHeight / 2 + 5}
            fill="white"
            textAnchor="middle"
          >
            MCU
          </text>

          {leftPins.map((pin, index) => (
            <Pin
              key={pin.id}
              pin={pin}
              y={100 + index * 60}
              side="left"
              onClick={() => lockPin(pin)}
            />
          ))}

          {rightPins.map((pin, index) => (
            <Pin
              key={pin.id}
              pin={pin}
              y={100 + index * 60}
              side="right"
              onClick={() => lockPin(pin)}
            />
          ))}
        </svg>
      </div>

      <ToastContainer />
    </>
  );
}

export default MCUBoard;