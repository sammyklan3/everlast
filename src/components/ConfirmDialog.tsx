"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

interface ConfirmDialogProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  onConfirm: () => void;
  actionLoading: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  children,
  title = "Are you absolutely sure?",
  description = "This action cannot be undone.",
  onConfirm,
  actionLoading,
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={actionLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={actionLoading} onClick={onConfirm}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
