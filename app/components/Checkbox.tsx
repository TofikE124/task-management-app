"use client";
import React from "react";

interface CheckboxProps {
  label: string;
  value: string;
  checked?: boolean;
  onChange?: (value: boolean) => void;
}

const Checkbox = ({
  label,
  value,
  onChange = () => {},
  checked = false,
}: CheckboxProps) => {
  return (
    <label className="checkbox-container">
      <input
        type="checkbox"
        defaultChecked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="checkmark"></span>
      <p className="text-black">{label}</p>
    </label>
  );
};

export default Checkbox;
