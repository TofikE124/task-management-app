"use client";
import { useSession } from "next-auth/react";
import { PropsWithChildren, Suspense, useEffect } from "react";
import defaultData from "../constatnts/defaultData";
import { useLoading } from "../contexts/LoadingProvider";
import appDataService from "../services/appDataService";

const AppInitializer = ({ children }: PropsWithChildren) => {
  const { setLoading } = useLoading();
  const session = useSession();

  useEffect(() => {
    const existingData = localStorage.getItem("appData");
    if (!existingData) {
      localStorage.setItem("appData", JSON.stringify(defaultData));
    }
  }, []);

  useEffect(() => {
    if (session.status == "loading") return;
    appDataService.initializeApp(session).then(() => {
      setLoading(false);
    });
  }, [session.status]);

  return <Suspense>{children}</Suspense>;
};

export default AppInitializer;
