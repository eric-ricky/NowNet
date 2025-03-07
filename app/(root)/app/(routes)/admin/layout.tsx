"use client";

import { useAdminAuthModal } from "@/hooks/modal-state/use-admin-auth-modal";
import { containerDivStyles } from "@/lib/data";
import { cn } from "@/lib/utils";
import { PropsWithChildren, useEffect } from "react";

const AdminLayout = ({ children }: PropsWithChildren) => {
  const { isAuthenticated, onOpen, isOpen } = useAdminAuthModal();

  // useEffect(() => {
  //   if (!isAuthenticated) onOpen();
  // }, [isAuthenticated, onOpen]);

  useEffect(() => {}, []);
  return (
    <div
      className={cn(
        containerDivStyles,
        !isAuthenticated ? "blur-none" : "blur-sm"
      )}
    >
      {children}
    </div>
  );
};

export default AdminLayout;
