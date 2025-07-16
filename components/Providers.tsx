"use client";

import { ReactNode, useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { IKContext } from "imagekitio-react";
 

interface ImageKitProviderProps {
  children: ReactNode;
  UrlEndPoint: string;
}

export const ImageKitProvider = ({ children, UrlEndPoint }: ImageKitProviderProps) => {
  const [authParams, setAuthParams] = useState<any>(null);

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const res = await fetch("/api/upload-auth");
        const data = await res.json();
        setAuthParams({
          authenticationParameter: data.authenticationParameter,
          publicKey: data.publicKey,
        });
      } catch (err) {
        console.error("Failed to fetch ImageKit auth:", err);
      }
    };

    fetchAuth();
  }, []);

  if (!authParams) return <p className="text-center">🔄 Loading ImageKit...</p>;

  return (
    <IKContext
      publicKey={authParams.publicKey}
      urlEndpoint={UrlEndPoint}
      authenticationEndpoint="/api/upload-auth"
      authenticationParameter={authParams.authenticationParameter}
    >
      {children}
    </IKContext>
  );
};

// Wrap the whole app with both Session and ImageKit providers
export function Providers({ children }: { children: ReactNode }) {
  const UrlEndPoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!;

  return (
    <SessionProvider>
      <ImageKitProvider UrlEndPoint={UrlEndPoint}>
        {children}
      </ImageKitProvider>
    </SessionProvider>
  );
}
