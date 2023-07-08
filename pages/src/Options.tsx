import React, { useEffect, useState } from "react";
import { buttonStyle } from "./buttons.css";

function Options() {
  // const presetButtonColors = ["#3aa757", "#e8453c", "#f9bb2d", "#4688f1"];

  // const [currentColor, setCurrentColor] = useState("");

  // useEffect(() => {
  //   chrome.storage.sync.get("color", (data) => {
  //     setCurrentColor(data.color);
  //   });
  // }, []);

  // useEffect(() => {
  //   chrome.storage.sync.set({ color: currentColor });
  // }, [currentColor]);

  return (
    <>
      {/* <div>
        {presetButtonColors.map((color) => (
          <button
            style={{ backgroundColor: color }}
            className={`${buttonStyle} ${
              color === currentColor ? currentButtonStyle : ""
            }`}
            onClick={() => setCurrentColor(color)}
          ></button>
        ))}
      </div>
      <div>
        <p>Choose a different background color!</p>
      </div> */}
    </>
  );
}

export default Options;
