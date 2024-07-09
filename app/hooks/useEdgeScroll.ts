import { useEffect, useRef, useState } from "react";
import { useDrag } from "./useDrag";

interface EdgeScrollConfig {
  thresholdPercent?: number; // Percentage of viewport width for edge threshold
  maxScrollSpeedPercent?: number; // Percentage of screen width for maxScrollSpeed
  minScrollSpeedPercent?: number; // Percentage of screen width for minScrollSpeed
  interval?: number;
  containerName?: string[];
}

const useEdgeScroll = ({
  thresholdPercent = 10, // Default to 10% of viewport width
  maxScrollSpeedPercent = 0.2, // 20% of screen width
  minScrollSpeedPercent = 0.02, // 2% of screen width
  interval = 5,
  containerName: containerNames,
}: EdgeScrollConfig = {}) => {
  const { draggedItemContainerName } = useDrag();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollDirection, setScrollDirection] = useState<
    "left" | "right" | null
  >(null);
  const [scrollSpeed, setScrollSpeed] = useState(0);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    if (target.dataset.noScroll) {
      reset();
      return;
    }

    // Configuration variables
    const accelerationFactor =
      (maxScrollSpeedPercent - minScrollSpeedPercent) / 100; // How fast the speed increases

    // Get the width of the viewport
    const viewportWidth = window.innerWidth;

    // Calculate edgeThreshold based on percentage of viewport width
    const edgeThreshold = Math.floor((viewportWidth * thresholdPercent) / 100);

    // Get the current position of the cursor relative to the viewport
    const cursorX = e.clientX;

    // Get the left position of the container
    const leftEdgeThreshold = containerRef.current?.offsetLeft || 0;

    if (cursorX >= viewportWidth - edgeThreshold) {
      const distanceToEdge = cursorX - (viewportWidth - edgeThreshold);
      const speed = Math.min(
        viewportWidth * maxScrollSpeedPercent,
        viewportWidth * minScrollSpeedPercent +
          distanceToEdge * accelerationFactor
      );
      setScrollDirection("right");
      setScrollSpeed(speed);
    } else if (cursorX <= leftEdgeThreshold + edgeThreshold) {
      const distanceToEdge = leftEdgeThreshold + edgeThreshold - cursorX;
      const speed = Math.min(
        viewportWidth * maxScrollSpeedPercent,
        viewportWidth * minScrollSpeedPercent +
          distanceToEdge * accelerationFactor
      );
      setScrollDirection("left");
      setScrollSpeed(speed);
    } else reset();
  };

  const handleDrop = () => {
    reset();
  };

  const reset = () => {
    setScrollDirection(null);
    setScrollSpeed(0);
  };

  useEffect(() => {
    const handleDragOverWrapper = (e: DragEvent) => handleDragOver(e);
    window.addEventListener("dragover", handleDragOverWrapper);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragover", handleDragOverWrapper);
      window.removeEventListener("drop", handleDrop);
    };
  }, [thresholdPercent, maxScrollSpeedPercent, minScrollSpeedPercent]);

  useEffect(() => {
    if (!containerNames?.includes(draggedItemContainerName || "")) return;
    const scrollInterval = setInterval(() => {
      if (scrollDirection && containerRef.current) {
        const scrollAmount =
          scrollDirection === "right" ? scrollSpeed : -scrollSpeed;
        containerRef.current.scrollBy({
          left: scrollAmount,
        });
      }
    }, interval); // Adjust the interval as needed (0.05 seconds)

    return () => clearInterval(scrollInterval);
  }, [scrollDirection, scrollSpeed, interval, draggedItemContainerName]);

  useEffect(() => {}, [scrollSpeed, scrollDirection]);

  return containerRef;
};

export default useEdgeScroll;
