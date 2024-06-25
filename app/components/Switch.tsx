import React from "react";

interface Props {
  defaultChecked?: boolean;
  onChange?: (value: boolean) => void;
}

const Switch = ({ defaultChecked, onChange = () => {} }: Props) => {
  return (
    <label className="relative inline-block w-10 h-5">
      <input
        type="checkbox"
        className="peer opacity-0 size-0"
        defaultChecked={defaultChecked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="absolute cursor-pointer inset-0 bg-main-purple duration-300 before:content-[''] before:absolute before:size-[14px] before:left-[3px] before:bottom-[3px] before:bg-white before:duration-300 peer-checked:before:translate-x-[20px] rounded-[34px] before:rounded-full"></span>
    </label>
  );
};

export default Switch;
