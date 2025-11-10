import React from "react";
import { useTimedFlow } from "../useTimedFlow";

const images = [
  "https://placehold.co/600x300?text=Car+1",
  "https://placehold.co/600x300?text=Car+2",
  "https://placehold.co/600x300?text=Car+3",
];

export default function App() {
  const { current, pause, resume, next, prev, reset, running } = useTimedFlow({
    steps: images.length,
    delay: 2000,
    loop: true,
  });

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <div onMouseEnter={pause} onMouseLeave={resume}>
        <img
          src={images[current]}
          alt={`car-${current}`}
          style={{ width: "100%" }}
        />
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={prev}>Prev</button>
        <button onClick={next}>Next</button>
        <button onClick={() => reset()}>Reset</button>
        <div style={{ marginLeft: "auto" }}>
          {running ? "Running" : "Paused"}
        </div>
      </div>
    </div>
  );
}
