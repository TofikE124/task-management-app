"use client";
import { motion } from "framer-motion";
import React from "react";

const LogoLoading = () => {
  const icon = {
    hidden: {
      opacity: 0,
      pathLength: 0,
      fill: "rgba(99, 95, 199, 0)",
    },
    visible: {
      opacity: 1,
      pathLength: 1,
      fill: "rgba(99, 95, 199, 1)",
    },
  };

  return (
    <div className="grid place-items-center size-full w-full h-screen bg-very-dark-grey">
      <div className="bg-gradient-to-r from-charcoal-grey to-dark-grey p-4 aspect-square rounded-md">
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="100"
          height="100"
          viewBox="0 0 100 100"
          className="stroke-[4] stroke-main-purple"
        >
          <motion.path
            d="M83.135 8l-45.135 46.268-21.144-20.044-14.856 14.864 36 34.912 60 -61.14z"
            variants={icon}
            initial="hidden"
            animate="visible"
            transition={{
              default: { duration: 1.5, ease: "easeInOut" },
              fill: { duration: 1.5, ease: [1, 0, 0.8, 1] },
            }}
          />
        </motion.svg>
      </div>
    </div>
  );
};

export default LogoLoading;
