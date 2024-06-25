// components/Icon.tsx

import React from "react";

interface IconProps {
  src: string;
  color?: string;
  bgColorClass?: string;
  width?: number;
  height?: number;
}

const Icon: React.FC<IconProps> = ({
  src,
  color,
  bgColorClass,
  width = 24,
  height = 24,
}) => {
  return (
    <div
      style={{
        backgroundColor: color ? color : "",
        WebkitMaskImage: `url(${src})`,
        WebkitMaskSize: "cover",
        maskImage: `url(${src})`,
        maskSize: "cover",
        width: `${width}px`,
        height: `${height}px`,
      }}
      className={bgColorClass}
    />
  );
};

export default Icon;
