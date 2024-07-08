"use client";
import React from "react";
import { Button } from "./components/Button";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="w-full h-screen grid place-items-center">
      <div className="flex flex-col justify-center items-center text-center max-w-[500px] sm:max-w-[80%]">
        <h1 className="text-[80px] text-medium-grey mt-2">404</h1>
        <h1 className="text-xl text-medium-grey">Page Not Found</h1>
        <h3 className="heading-m mt-4">
          The page you are looking for might have been removed or had it&apos;s
          name changed or is temporarily unavilable.
        </h3>
        <Link href="/">
          <Button size="lg" className="mt-4">
            Go To Home Page
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
