import type { ReactNode } from "react";

export default function ResellerInvitationsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{`
        [style*="color:#92400e"],
        [style*="color: #92400e"],
        [style*="color:rgb(146, 64, 14)"],
        [style*="color: rgb(146, 64, 14)"] {
          display: none !important;
        }
      `}</style>
      {children}
    </>
  );
}
