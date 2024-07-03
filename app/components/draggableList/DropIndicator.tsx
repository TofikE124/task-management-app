import { useEffect, useRef } from "react";

interface DropIndicatorProps {
  beforeId: string;
  containerName: string;
  containerId: string;
}
const DropIndicator = ({
  beforeId,
  containerName,
  containerId,
}: DropIndicatorProps) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    ref.current.dataset[`${containerName}Id`] = containerId;
  }, []);

  return (
    <div
      ref={ref}
      onDragOver={handleDragOver}
      data-before={beforeId}
      data-container-name={containerName}
      data-type="dropIndicator"
      className="my-0.5 h-0.5 w-full bg-main-purple opacity-0"
    ></div>
  );
};

export default DropIndicator;
