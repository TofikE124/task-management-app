"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { initializeApp } from "../services/appDataService";

const NextAuthSession = () => {
  const session = useSession();
  useEffect(() => {
    if (session.status == "loading") return;
    initializeApp(session);
  }, [session]);

  return <></>;
};

export default NextAuthSession;
