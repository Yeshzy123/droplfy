"use client";

import { useEffect } from "react";

export function BodyWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Remove any attributes added by browser extensions
    const body = document.body;
    if (body.hasAttribute('bis_register')) {
      body.removeAttribute('bis_register');
    }
    if (body.hasAttribute('__processed_ec6de467-5696-41e4-bc77-f323a1681517__')) {
      body.removeAttribute('__processed_ec6de467-5696-41e4-bc77-f323a1681517__');
    }
  }, []);

  return <>{children}</>;
}
