"use client";
import React, { PropsWithChildren } from "react";

interface CheckboxProps {
  label: string;
  value: string;
  checked?: boolean;
}

const Checkbox = ({ label, value, checked = false }: CheckboxProps) => {
  return (
    <label className="checkbox-container">
      <input type="checkbox" defaultChecked={checked} />
      <span className="checkmark"></span>
      <p className="text-black">{label}</p>
    </label>
  );
};

export default Checkbox;
