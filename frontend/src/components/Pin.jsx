import { FaLock } from "react-icons/fa";

function Pin({ pin, y, side, onClick }) {
  const isLeft = side === "left";

  const lineStart = isLeft ? 150 : 750;
  const lineEnd = isLeft ? 100 : 800;

  const boxX = isLeft ? 70 : 800;

  return (
    <g
      onClick={!pin.locked ? onClick : undefined}
      style={{
        cursor: pin.locked ? "not-allowed" : "pointer",
      }}
    >
      <title>
        {pin.pinName}
        {" | "}
        {pin.type}
      </title>

      <line
        x1={lineStart}
        y1={y}
        x2={lineEnd}
        y2={y}
        stroke="black"
      />

      <rect
        x={boxX}
        y={y - 15}
        width="30"
        height="30"
        fill={pin.locked ? "red" : "#22c55e"}
        rx="4"
      />

      <text
        x={isLeft ? 10 : 845}
        y={y + 5}
        fill="black"
        fontSize="14"
      >
        P{pin.pinNumber}
      </text>

      <text
        x={isLeft ? 10 : 845}
        y={y + 25}
        fill="#9e9e9e"
        fontSize="12"
      >
        {pin.pinName}
      </text>

      {pin.locked && (
        <foreignObject
          x={isLeft ? 105 : 835}
          y={y - 10}
          width="20"
          height="20"
        >
          <FaLock color="gold" />
        </foreignObject>
      )}
    </g>
  );
}

export default Pin;