import React from "react";
import "./style.css";

const Dropdown = ({ label, options, value, onChange, optionLabelKey = "title", optionValueKey }) => {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label className="dropdown-label">{label}</label>
      <select
        className="dropdown-select"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt[optionValueKey || "id"]}>
            {opt[optionLabelKey]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
