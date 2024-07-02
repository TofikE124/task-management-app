import { useEffect, useRef, useState } from "react";

const useEdgeScroll = (
  edgeThreshold = 200,
  maxScrollSpeed = 15,
  minScrollSpeed = 1,
  interval = 5
) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollDirection, setScrollDirection] = useState<
    "left" | "right" | null
  >(null);
  const [scrollSpeed, setScrollSpeed] = useState(0);

  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();

      // Configuration variables
      const accelerationFactor =
        (maxScrollSpeed - minScrollSpeed) / edgeThreshold; // How fast the speed increases

      // Get the width of the viewport
      const viewportWidth = window.innerWidth;

      // Get the current position of the cursor relative to the viewport
      const cursorX = e.clientX;

      // Get the left position of the container
      const leftEdgeThreshold = containerRef.current?.offsetLeft || 0;

      if (cursorX >= viewportWidth - edgeThreshold) {
        const distanceToEdge = cursorX - (viewportWidth - edgeThreshold);
        const speed = Math.min(
          maxScrollSpeed,
          minScrollSpeed + distanceToEdge * accelerationFactor
        );
        setScrollDirection("right");
        setScrollSpeed(speed);
      } else if (cursorX <= leftEdgeThreshold + edgeThreshold) {
        const distanceToEdge = leftEdgeThreshold + edgeThreshold - cursorX;
        const speed = Math.min(
          maxScrollSpeed,
          minScrollSpeed + distanceToEdge * accelerationFactor
        );
        setScrollDirection("left");
        setScrollSpeed(speed);
      } else {
        setScrollDirection(null);
        setScrollSpeed(0);
      }
    };

    const handleDragEnd = () => {
      setScrollDirection(null);
      setScrollSpeed(0);
    };

    const handleDragOverWrapper = (e: DragEvent) => handleDragOver(e);
    window.addEventListener("dragover", handleDragOverWrapper);
    window.addEventListener("dragend", handleDragEnd);

    return () => {
      window.removeEventListener("dragover", handleDragOverWrapper);
      window.removeEventListener("dragend", handleDragEnd);
    };
  }, [edgeThreshold, maxScrollSpeed, minScrollSpeed]);

  useEffect(() => {
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
  }, [scrollDirection, scrollSpeed, interval]);

  return containerRef;
};

export default useEdgeScroll;
