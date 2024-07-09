"use client";
import { useSession } from "next-auth/react";
import React, { PropsWithChildren, Suspense, useEffect } from "react";
import { useLoading } from "../contexts/LoadingProvider";
import appDataService from "../services/appDataService";

const AppInitializer = ({ children }: PropsWithChildren) => {
  const { loading, setLoading } = useLoading();
  const session = useSession();

  useEffect(() => {
    if (session.status == "loading") return;
    appDataService.initializeApp(session).then(() => {
      setLoading(false);
    });
  }, [session.status]);

  return <Suspense>{children}</Suspense>;
};

export default AppInitializer;
