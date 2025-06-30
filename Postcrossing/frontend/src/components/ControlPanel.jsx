import React from "react";
import "./style.css";

const ControlPanel = ({ onReset }) => {
  return (
    <div className="border p-4 mt-4">
      <button onClick={onReset} className="reset-button">
        Reset
      </button>
    </div>
  );
};

export default ControlPanel;
