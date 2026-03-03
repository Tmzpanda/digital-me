"use client";

import { createContext, useContext, useState } from "react";

const TocContext = createContext<{
  open: boolean;
  setOpen: (v: boolean) => void;
  hasHeadings: boolean;
  setHasHeadings: (v: boolean) => void;
}>({ open: false, setOpen: () => {}, hasHeadings: false, setHasHeadings: () => {} });

export function TocProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [hasHeadings, setHasHeadings] = useState(false);
  return (
    <TocContext.Provider value={{ open, setOpen, hasHeadings, setHasHeadings }}>
      {children}
    </TocContext.Provider>
  );
}

export function useToc() {
  return useContext(TocContext);
}
