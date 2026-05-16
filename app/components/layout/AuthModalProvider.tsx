"use client";

import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from "react";
import { LoginModal } from "../modals/LoginModal";
import { SignupModal } from "../modals/SignupModal";
import { AdvisorApplyModal } from "../modals/AdvisorApplyModal";
import { ApplicationSubmittedModal } from "../modals/ApplicationSubmittedModal";

type ModalKind = "login" | "signup" | "apply" | "submitted" | null;

type Ctx = {
  open: (m: Exclude<ModalKind, null>) => void;
  close: () => void;
  current: ModalKind;
};

const AuthModalContext = createContext<Ctx | undefined>(undefined);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<ModalKind>(null);
  const open = useCallback((m: Exclude<ModalKind, null>) => setCurrent(m), []);
  const close = useCallback(() => setCurrent(null), []);
  const value = useMemo(() => ({ open, close, current }), [open, close, current]);

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      <LoginModal open={current === "login"} onClose={close} onSwitchToSignup={() => open("signup")} />
      <SignupModal open={current === "signup"} onClose={close} onSwitchToLogin={() => open("login")} />
      <AdvisorApplyModal open={current === "apply"} onClose={close} onSubmitted={() => open("submitted")} />
      <ApplicationSubmittedModal open={current === "submitted"} onClose={close} />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be used inside <AuthModalProvider>");
  return ctx;
}
