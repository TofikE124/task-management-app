"use client";
import { useSession } from "next-auth/react";
import React, { PropsWithChildren, useEffect } from "react";
import { initializeApp } from "../services/appDataService";
import { useLoading } from "../contexts/LoadingProvider";

const AppInitializer = ({ children }: PropsWithChildren) => {
  const { loading, setLoading } = useLoading();
  const session = useSession();

  useEffect(() => {
    if (session.status == "loading") return;
    initializeApp(session).then(() => {
      setLoading(false);
    });
  }, [session.status]);

  return <>{children}</>;
};

export default AppInitializer;
