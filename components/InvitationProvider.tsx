"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

type InvitationContextType = {
  opened: boolean;
  setOpened: (value: boolean) => void;
};

const InvitationContext = createContext<InvitationContextType | null>(null);

export function InvitationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [opened, setOpened] = useState(false);

  return (
    <InvitationContext.Provider
      value={{ opened, setOpened }}
    >
      {children}
    </InvitationContext.Provider>
  );
}

export function useInvitation() {
  const context = useContext(InvitationContext);

  if (!context) {
    throw new Error(
      "useInvitation must be used inside InvitationProvider"
    );
  }

  return context;
}